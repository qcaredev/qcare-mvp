/**
 * @file clinics-schema.ts
 *
 * @description
 *  Drizzle ORM table definition for **`clinics`**—the top‑level tenant
 *  entity that owns queue items, settings, and analytics.
 *
 *  Every other domain table contains a `clinicId` FK that cascades on delete,
 *  allowing a single statement to purge all clinic‑scoped data if a clinic is
 *  removed from the platform.
 *
 * @columns
 *  - id          : Primary UUID identifier (generated server‑side)
 *  - name        : Human‑readable clinic name (required)
 *  - createdAt   : Record creation timestamp (default = now)
 *  - updatedAt   : Record update timestamp (auto‑updated on mutation)
 *
 * @notes
 *  - We **always** include an `updatedAt` column (project rule) even when
 *    it is not explicitly mentioned in the spec.
 *  - Indexing `name` is optional at this stage; query volume for clinic
 *    listing is expected to be low. We will add indexes when analytics
 *    warrants it.
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const clinicsTable = pgTable("clinics", {
  /** Primary key — generated UUID */
  id: uuid("id").defaultRandom().primaryKey(),

  /** Display name of the clinic */
  name: text("name").notNull(),

  /** Record creation timestamp */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Record last‑update timestamp
   * Automatically updates on every mutation via `$onUpdate`.
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/** Insert type for `clinicsTable` (used when creating a new clinic) */
export type InsertClinic = typeof clinicsTable.$inferInsert

/** Select type for `clinicsTable` (used when reading a clinic) */
export type SelectClinic = typeof clinicsTable.$inferSelect
