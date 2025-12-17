import { eq, like, or, and, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, elites, organizations, politicalDecisions, 
  eliteConnections, eliteOrganizations, reports, posts, events, 
  publications, educationalResources, newsletterSubscriptions, expertAccessRequests,
  Elite, Organization, PoliticalDecision, Report, Post, Event, Publication, EducationalResource
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "affiliation", "researchInterests"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Elite queries
export async function searchElites(params: {
  query?: string;
  sphereOfInfluence?: string;
  politicalOrientation?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (params.query) {
    conditions.push(
      or(
        like(elites.name, `%${params.query}%`),
        like(elites.biography, `%${params.query}%`)
      )
    );
  }
  
  if (params.sphereOfInfluence) {
    conditions.push(like(elites.sphereOfInfluence, `%${params.sphereOfInfluence}%`));
  }
  
  if (params.politicalOrientation) {
    conditions.push(eq(elites.politicalOrientation, params.politicalOrientation));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db
    .select()
    .from(elites)
    .where(whereClause)
    .limit(params.limit || 50)
    .offset(params.offset || 0)
    .orderBy(asc(elites.name));
}

export async function getEliteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(elites).where(eq(elites.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllElites() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(elites).orderBy(asc(elites.name));
}

// Organization queries
export async function searchOrganizations(params: {
  query?: string;
  type?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (params.query) {
    conditions.push(
      or(
        like(organizations.name, `%${params.query}%`),
        like(organizations.description, `%${params.query}%`)
      )
    );
  }
  
  if (params.type) {
    conditions.push(eq(organizations.type, params.type));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db
    .select()
    .from(organizations)
    .where(whereClause)
    .limit(params.limit || 50)
    .offset(params.offset || 0)
    .orderBy(asc(organizations.name));
}

export async function getOrganizationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Political decisions queries
export async function searchPoliticalDecisions(params: {
  query?: string;
  type?: string;
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (params.query) {
    conditions.push(
      or(
        like(politicalDecisions.title, `%${params.query}%`),
        like(politicalDecisions.description, `%${params.query}%`)
      )
    );
  }
  
  if (params.type) {
    conditions.push(eq(politicalDecisions.type, params.type));
  }
  
  if (params.category) {
    conditions.push(eq(politicalDecisions.category, params.category));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db
    .select()
    .from(politicalDecisions)
    .where(whereClause)
    .limit(params.limit || 50)
    .offset(params.offset || 0)
    .orderBy(desc(politicalDecisions.dateEnacted));
}

export async function getPoliticalDecisionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(politicalDecisions).where(eq(politicalDecisions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Elite connections
export async function getEliteConnections(eliteId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(eliteConnections)
    .where(
      or(
        eq(eliteConnections.eliteId1, eliteId),
        eq(eliteConnections.eliteId2, eliteId)
      )
    );
}

// Elite organizations
export async function getEliteOrganizations(eliteId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(eliteOrganizations)
    .where(eq(eliteOrganizations.eliteId, eliteId));
}

// Reports queries
export async function getReports(params: {
  type?: string;
  accessLevel?: "public" | "registered" | "expert";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (params.type) {
    conditions.push(eq(reports.type, params.type));
  }
  
  if (params.accessLevel) {
    conditions.push(eq(reports.accessLevel, params.accessLevel));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db
    .select()
    .from(reports)
    .where(whereClause)
    .limit(params.limit || 20)
    .offset(params.offset || 0)
    .orderBy(desc(reports.publishDate));
}

export async function getReportById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Posts queries
export async function getPosts(params: {
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (params.category) {
    conditions.push(eq(posts.category, params.category));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db
    .select()
    .from(posts)
    .where(whereClause)
    .limit(params.limit || 20)
    .offset(params.offset || 0)
    .orderBy(desc(posts.publishDate));
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Events queries
export async function getEvents(params: {
  status?: "upcoming" | "ongoing" | "completed";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (params.status) {
    conditions.push(eq(events.status, params.status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db
    .select()
    .from(events)
    .where(whereClause)
    .limit(params.limit || 20)
    .offset(params.offset || 0)
    .orderBy(desc(events.startDate));
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Publications queries
export async function getPublications(params: {
  publicationType?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (params.publicationType) {
    conditions.push(eq(publications.publicationType, params.publicationType));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db
    .select()
    .from(publications)
    .where(whereClause)
    .limit(params.limit || 20)
    .offset(params.offset || 0)
    .orderBy(desc(publications.publicationDate));
}

// Educational resources queries
export async function getEducationalResources(params: {
  resourceType?: string;
  accessLevel?: "public" | "registered" | "expert";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  
  if (params.resourceType) {
    conditions.push(eq(educationalResources.resourceType, params.resourceType));
  }
  
  if (params.accessLevel) {
    conditions.push(eq(educationalResources.accessLevel, params.accessLevel));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db
    .select()
    .from(educationalResources)
    .where(whereClause)
    .limit(params.limit || 20)
    .offset(params.offset || 0);
}

// Newsletter subscription
export async function subscribeNewsletter(email: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(newsletterSubscriptions).values({
    email,
    name: name || null,
  }).onDuplicateKeyUpdate({
    set: { isActive: "yes" },
  });
}

// Expert access requests
export async function createExpertAccessRequest(data: {
  userId?: number;
  name: string;
  email: string;
  affiliation?: string;
  researchInterests?: string;
  justification?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(expertAccessRequests).values({
    userId: data.userId || null,
    name: data.name,
    email: data.email,
    affiliation: data.affiliation || null,
    researchInterests: data.researchInterests || null,
    justification: data.justification || null,
  });
}

export async function getExpertAccessRequests(status?: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return await db
      .select()
      .from(expertAccessRequests)
      .where(eq(expertAccessRequests.status, status))
      .orderBy(desc(expertAccessRequests.createdAt));
  }

  return await db
    .select()
    .from(expertAccessRequests)
    .orderBy(desc(expertAccessRequests.createdAt));
}

export async function updateExpertAccessRequest(id: number, status: "approved" | "rejected", reviewedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(expertAccessRequests)
    .set({
      status,
      reviewedAt: new Date(),
      reviewedBy,
    })
    .where(eq(expertAccessRequests.id, id));
}

// Get database statistics
export async function getDatabaseStats() {
  const db = await getDb();
  if (!db) return { elites: 0, organizations: 0, decisions: 0, reports: 0 };

  const [elitesCount] = await db.select({ count: sql<number>`count(*)` }).from(elites);
  const [orgsCount] = await db.select({ count: sql<number>`count(*)` }).from(organizations);
  const [decisionsCount] = await db.select({ count: sql<number>`count(*)` }).from(politicalDecisions);
  const [reportsCount] = await db.select({ count: sql<number>`count(*)` }).from(reports);

  return {
    elites: elitesCount?.count || 0,
    organizations: orgsCount?.count || 0,
    decisions: decisionsCount?.count || 0,
    reports: reportsCount?.count || 0,
  };
}
