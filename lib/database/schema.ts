import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { FeedbackProps } from "@/types";

// ENUM for auth providers
export const providerEnum = pgEnum("provider", ["google", "email"]);

// ENUM for experience levels
export const experienceLevelEnum = pgEnum("experience_level", [
  "Entry level",
  "Mid Level",
  "Senior Level",
]);
// USERS TABLE
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  image: text("image"),
  provider: providerEnum("provider").notNull().default("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RESUME SCANS TABLE (1-to-many with users)
export const resumeScansTable = pgTable("resume_scans", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  // Original form data
  jobTitle: varchar("job_title", { length: 255 }),
  company: varchar("company", { length: 255 }),
  jobDescription: text("job_description"),
  experienceLevel: experienceLevelEnum("experience_level"),

  // File information
  fileName: varchar("file_name", { length: 255 }),
  imagePaths: jsonb("image_paths").$type<string[]>(),

  // Analysis results
  feedback: jsonb("feedback").$type<FeedbackProps>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Relations --- 
export const usersRelations = relations(usersTable, ({ many }) => ({
  resumeScans: many(resumeScansTable), 
}));

export const resumeScansRelations = relations(resumeScansTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [resumeScansTable.userId],
    references: [usersTable.id],
  }),
}));
