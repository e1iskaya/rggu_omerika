import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(user?: AuthenticatedUser): TrpcContext {
  return {
    user: user || undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("elites.search", () => {
  it("allows public access to search elites", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.elites.search({
      query: "",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts search parameters", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.elites.search({
      query: "test",
      sphereOfInfluence: "Big Tech",
      politicalOrientation: "Liberal",
      limit: 5,
      offset: 0,
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("organizations.search", () => {
  it("allows public access to search organizations", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.organizations.search({
      query: "",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("decisions.search", () => {
  it("allows public access to search political decisions", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.decisions.search({
      query: "",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("reports.list", () => {
  it("returns public reports for unauthenticated users", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.list({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("returns registered reports for authenticated users", async () => {
    const user: AuthenticatedUser = {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
    const ctx = createTestContext(user);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.list({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("returns expert reports for expert users", async () => {
    const user: AuthenticatedUser = {
      id: 1,
      openId: "expert-user",
      email: "expert@example.com",
      name: "Expert User",
      loginMethod: "manus",
      role: "expert",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
    const ctx = createTestContext(user);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.list({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("events.list", () => {
  it("allows public access to list events", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.events.list({
      status: "upcoming",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("publications.list", () => {
  it("allows public access to list publications", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.publications.list({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("newsletter.subscribe", () => {
  it("accepts email subscription", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({
      email: "test@example.com",
      name: "Test User",
    });

    expect(result.success).toBe(true);
  });
});

describe("expertAccess.request", () => {
  it("accepts expert access request", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.expertAccess.request({
      name: "Test Researcher",
      email: "researcher@example.com",
      affiliation: "Test University",
      researchInterests: "Elite studies",
      justification: "Need access for research",
    });

    expect(result.success).toBe(true);
  });
});

describe("stats.get", () => {
  it("returns database statistics", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stats.get();

    expect(result).toHaveProperty("elites");
    expect(result).toHaveProperty("organizations");
    expect(result).toHaveProperty("decisions");
    expect(result).toHaveProperty("reports");
    expect(typeof result.elites).toBe("number");
    expect(typeof result.organizations).toBe("number");
    expect(typeof result.decisions).toBe("number");
    expect(typeof result.reports).toBe("number");
  });
});
