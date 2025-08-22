/**
 * @file branches-schema.ts
 *
 * @description
 * Drizzle ORM table definition for **`branches`**. Each row represents a
 * specific clinic or location that belongs to a parent `organization`. This
 * table was formerly `clinics`.
 *
 * All branch-specific data (like queue items and settings) will link to this
 * table via a `branchId` foreign key.
 *
 * @columns
 * - id (uuid, PK)             : Primary UUID identifier for the branch.
 * - organizationId (uuid, FK) : The parent organization that owns this branch.
 * - name (text)               : Human-readable name of the branch (e.g., "Hyderabad Branch").
 * - createdAt / updatedAt     : Standard audit timestamps.
 */
"use server"

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { organizationsTable } from "./organization-schema"

export const branchesTable = pgTable("branches", {
  /** Primary key — generated UUID */
  id: uuid("id").defaultRandom().primaryKey(),

  /** Foreign key linking to the parent organization */
  organizationId: uuid("organization_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Display name of the branch/clinic */
  name: text("name").notNull(),

  /** Record creation timestamp */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Record last-update timestamp.
   * Automatically updates on every mutation via `$onUpdate`.
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/** Drizzle type for inserting a new branch record */
export type InsertBranch = typeof branchesTable.$inferInsert
/** Drizzle type for selecting a branch record */
export type SelectBranch = typeof branchesTable.$inferSelect
