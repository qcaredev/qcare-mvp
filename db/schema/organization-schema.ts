/**
 * @file organizations-schema.ts
 *
 * @description
 * Drizzle ORM table definition for **`organizations`**. This is the top-level
 * tenant entity in the application's hierarchical structure. Each organization
 * can own multiple branches (clinics).
 *
 * @see
 * - `db/schema/branches-schema.ts` for the child entity.
 *
 * @columns
 * - id (uuid, PK)         : The unique identifier for the organization.
 * - name (text)           : The human-readable name of the organization (e.g., "NIMS Hospitals").
 * - createdAt / updatedAt : Standard audit timestamps.
 */
// "use server"

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const organizationsTable = pgTable("organizations", {
  /** Primary key — generated UUID */
  id: uuid("id").defaultRandom().primaryKey(),

  /** Display name of the organization */
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

/** Drizzle type for inserting a new organization record */
export type InsertOrganization = typeof organizationsTable.$inferInsert
/** Drizzle type for selecting an organization record */
export type SelectOrganization = typeof organizationsTable.$inferSelect