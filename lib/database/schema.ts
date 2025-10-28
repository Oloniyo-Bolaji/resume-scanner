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

// ENUM for auth providers
export const providerEnum = pgEnum("provider", ["google", "email"]);

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

// RESUME HISTORIES TABLE (1-to-1 with users)
export const resumeHistories = pgTable("resume_histories", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  resumes: jsonb("resumes").$type<Array<{
    id: string;
    filename: string;
    fileUrl: string;
    uploadedAt: string;
    // Add other resume metadata as needed
  }>>().default([]).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Relations ---
export const usersRelations = relations(usersTable, ({ one }) => ({
  resumeHistory: one(resumeHistories, {
    fields: [usersTable.id],
    references: [resumeHistories.userId],
  }),
}));

export const resumeHistoriesRelations = relations(resumeHistories, ({ one }) => ({
  user: one(usersTable, {
    fields: [resumeHistories.userId],
    references: [usersTable.id],
  }),
}));
