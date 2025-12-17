import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["guest", "user", "expert", "admin"]).default("user").notNull(),
  affiliation: text("affiliation"), // University or organization
  researchInterests: text("researchInterests"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Elite personalities database
 */
export const elites = mysqlTable("elites", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 50 }),
  education: text("education"),
  careerPath: text("careerPath"),
  currentPositions: json("currentPositions").$type<string[]>(),
  pastPositions: json("pastPositions").$type<string[]>(),
  politicalOrientation: varchar("politicalOrientation", { length: 100 }),
  sphereOfInfluence: varchar("sphereOfInfluence", { length: 255 }), // Big Tech, Defense, Finance, etc.
  netWorth: decimal("netWorth", { precision: 15, scale: 2 }),
  biography: text("biography"),
  publicStatements: text("publicStatements"),
  foreignPolicyPositions: text("foreignPolicyPositions"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Elite = typeof elites.$inferSelect;
export type InsertElite = typeof elites.$inferInsert;

/**
 * Organizations (corporations, think tanks, political structures)
 */
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // Corporation, Think Tank, Political Structure, Lobbying Group
  description: text("description"),
  founded: varchar("founded", { length: 50 }),
  headquarters: varchar("headquarters", { length: 255 }),
  marketCap: decimal("marketCap", { precision: 15, scale: 2 }),
  revenue: decimal("revenue", { precision: 15, scale: 2 }),
  employees: int("employees"),
  lobbyingSpending: decimal("lobbyingSpending", { precision: 15, scale: 2 }),
  politicalDonations: decimal("politicalDonations", { precision: 15, scale: 2 }),
  foreignPolicyPositions: text("foreignPolicyPositions"),
  logoUrl: varchar("logoUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

/**
 * Political decisions and legislation
 */
export const politicalDecisions = mysqlTable("politicalDecisions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // Legislative Act, Executive Order, Budget Resolution
  category: varchar("category", { length: 100 }), // Foreign Policy, Domestic Policy
  description: text("description"),
  dateEnacted: timestamp("dateEnacted"),
  administration: varchar("administration", { length: 100 }),
  keyPlayers: json("keyPlayers").$type<number[]>(), // Array of elite IDs
  lobbyingInfluence: text("lobbyingInfluence"),
  impact: text("impact"),
  documentUrl: varchar("documentUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PoliticalDecision = typeof politicalDecisions.$inferSelect;
export type InsertPoliticalDecision = typeof politicalDecisions.$inferInsert;

/**
 * Connections between elites
 */
export const eliteConnections = mysqlTable("eliteConnections", {
  id: int("id").autoincrement().primaryKey(),
  eliteId1: int("eliteId1").notNull(),
  eliteId2: int("eliteId2").notNull(),
  connectionType: varchar("connectionType", { length: 100 }).notNull(), // Professional, Political, Financial, Personal
  description: text("description"),
  strength: int("strength").default(1), // 1-10 scale
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EliteConnection = typeof eliteConnections.$inferSelect;
export type InsertEliteConnection = typeof eliteConnections.$inferInsert;

/**
 * Elite-Organization relationships
 */
export const eliteOrganizations = mysqlTable("eliteOrganizations", {
  id: int("id").autoincrement().primaryKey(),
  eliteId: int("eliteId").notNull(),
  organizationId: int("organizationId").notNull(),
  role: varchar("role", { length: 255 }),
  startDate: varchar("startDate", { length: 50 }),
  endDate: varchar("endDate", { length: 50 }),
  isCurrent: mysqlEnum("isCurrent", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EliteOrganization = typeof eliteOrganizations.$inferSelect;
export type InsertEliteOrganization = typeof eliteOrganizations.$inferInsert;

/**
 * Analytical reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // Monthly Bulletin, Quarterly Report, Annual Report, Case Study
  summary: text("summary"),
  content: text("content"),
  accessLevel: mysqlEnum("accessLevel", ["public", "registered", "expert"]).default("public").notNull(),
  publishDate: timestamp("publishDate").notNull(),
  author: varchar("author", { length: 255 }),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * News and blog posts
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  category: varchar("category", { length: 100 }), // News, Analysis, Commentary
  author: varchar("author", { length: 255 }),
  publishDate: timestamp("publishDate").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Events calendar
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  eventType: varchar("eventType", { length: 100 }), // Seminar, Conference, Round Table, Webinar
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  location: varchar("location", { length: 255 }),
  registrationUrl: varchar("registrationUrl", { length: 500 }),
  recordingUrl: varchar("recordingUrl", { length: 500 }),
  status: mysqlEnum("status", ["upcoming", "ongoing", "completed"]).default("upcoming").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Publications
 */
export const publications = mysqlTable("publications", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  authors: text("authors"),
  publicationType: varchar("publicationType", { length: 100 }), // Article, Book, Presentation, Interview
  publicationDate: timestamp("publicationDate"),
  journal: varchar("journal", { length: 255 }),
  abstract: text("abstract"),
  url: varchar("url", { length: 500 }),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Publication = typeof publications.$inferSelect;
export type InsertPublication = typeof publications.$inferInsert;

/**
 * Educational resources
 */
export const educationalResources = mysqlTable("educationalResources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  resourceType: varchar("resourceType", { length: 100 }), // Course, Methodological Material, Guideline
  content: text("content"),
  accessLevel: mysqlEnum("accessLevel", ["public", "registered", "expert"]).default("public").notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EducationalResource = typeof educationalResources.$inferSelect;
export type InsertEducationalResource = typeof educationalResources.$inferInsert;

/**
 * Newsletter subscriptions
 */
export const newsletterSubscriptions = mysqlTable("newsletterSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes").notNull(),
});

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;

/**
 * Expert access requests
 */
export const expertAccessRequests = mysqlTable("expertAccessRequests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  affiliation: text("affiliation"),
  researchInterests: text("researchInterests"),
  justification: text("justification"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: int("reviewedBy"),
});

export type ExpertAccessRequest = typeof expertAccessRequests.$inferSelect;
export type InsertExpertAccessRequest = typeof expertAccessRequests.$inferInsert;
