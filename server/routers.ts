import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Helper to check user role
const requireRole = (userRole: string, allowedRoles: string[]) => {
  if (!allowedRoles.includes(userRole)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
  }
};

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Database statistics
  stats: router({
    get: publicProcedure.query(async () => {
      return await db.getDatabaseStats();
    }),
  }),

  // Elites module
  elites: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        sphereOfInfluence: z.string().optional(),
        politicalOrientation: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.searchElites(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const elite = await db.getEliteById(input.id);
        if (!elite) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Elite not found" });
        }
        return elite;
      }),
    
    getAll: publicProcedure.query(async () => {
      return await db.getAllElites();
    }),
    
    getConnections: publicProcedure
      .input(z.object({ eliteId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEliteConnections(input.eliteId);
      }),
    
    getOrganizations: publicProcedure
      .input(z.object({ eliteId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEliteOrganizations(input.eliteId);
      }),
  }),

  // Organizations module
  organizations: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        type: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.searchOrganizations(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const org = await db.getOrganizationById(input.id);
        if (!org) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
        }
        return org;
      }),
  }),

  // Political decisions module
  decisions: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.searchPoliticalDecisions(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const decision = await db.getPoliticalDecisionById(input.id);
        if (!decision) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Political decision not found" });
        }
        return decision;
      }),
  }),

  // Reports module
  reports: router({
    list: publicProcedure
      .input(z.object({
        type: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input, ctx }) => {
        // Determine access level based on user role
        let accessLevel: "public" | "registered" | "expert" = "public";
        if (ctx.user) {
          if (ctx.user.role === "expert" || ctx.user.role === "admin") {
            accessLevel = "expert";
          } else {
            accessLevel = "registered";
          }
        }
        
        const reports = await db.getReports({
          type: input.type,
          accessLevel,
          limit: input.limit,
          offset: input.offset,
        });
        
        return reports;
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const report = await db.getReportById(input.id);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Report not found" });
        }
        
        // Check access level
        if (report.accessLevel === "registered" && !ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Login required" });
        }
        if (report.accessLevel === "expert" && (!ctx.user || (ctx.user.role !== "expert" && ctx.user.role !== "admin"))) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Expert access required" });
        }
        
        return report;
      }),
  }),

  // Posts/News module
  posts: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getPosts(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
        }
        return post;
      }),
  }),

  // Events module
  events: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(["upcoming", "ongoing", "completed"]).optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getEvents(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const event = await db.getEventById(input.id);
        if (!event) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        }
        return event;
      }),
  }),

  // Publications module
  publications: router({
    list: publicProcedure
      .input(z.object({
        publicationType: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getPublications(input);
      }),
  }),

  // Educational resources module
  education: router({
    list: publicProcedure
      .input(z.object({
        resourceType: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input, ctx }) => {
        // Determine access level
        let accessLevel: "public" | "registered" | "expert" = "public";
        if (ctx.user) {
          if (ctx.user.role === "expert" || ctx.user.role === "admin") {
            accessLevel = "expert";
          } else {
            accessLevel = "registered";
          }
        }
        
        return await db.getEducationalResources({
          resourceType: input.resourceType,
          accessLevel,
          limit: input.limit,
          offset: input.offset,
        });
      }),
  }),

  // Newsletter subscription
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.subscribeNewsletter(input.email, input.name);
        return { success: true };
      }),
  }),

  // Expert access requests
  expertAccess: router({
    request: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        affiliation: z.string().optional(),
        researchInterests: z.string().optional(),
        justification: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createExpertAccessRequest({
          userId: ctx.user?.id,
          name: input.name,
          email: input.email,
          affiliation: input.affiliation,
          researchInterests: input.researchInterests,
          justification: input.justification,
        });
        return { success: true };
      }),
    
    list: protectedProcedure
      .input(z.object({
        status: z.enum(["pending", "approved", "rejected"]).optional(),
      }))
      .query(async ({ input, ctx }) => {
        requireRole(ctx.user.role, ["admin"]);
        return await db.getExpertAccessRequests(input.status);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["approved", "rejected"]),
      }))
      .mutation(async ({ input, ctx }) => {
        requireRole(ctx.user.role, ["admin"]);
        await db.updateExpertAccessRequest(input.id, input.status, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
