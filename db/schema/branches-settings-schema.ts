/**
 * @file branch-settings-schema.ts
 *
 * @description
 * Drizzle ORM table definition for **`branch_settings`**.
 * Holds user-configurable behavior for a specific branch, such as WhatsApp
 * alert thresholds. This table was formerly `clinic_settings`.
 *
 * @columns
 * - branchId (FK)           : The owning branch (unique).
 * - alertThreshold        : Integer (# patients away to trigger alert).
 * - defaultLanguage         : Text (e.g., 'en' | 'hi').
 * - whatsappTemplateId    : Twilio template reference.
 * - createdAt / updatedAt   : Standard audit timestamps.
 *
 * @rules
 * - Exactly **one row per branch** enforced via a unique constraint.
 */
"use server"

import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  unique
} from "drizzle-orm/pg-core"
import { branchesTable } from "./branches-schema"

export const branchSettingsTable = pgTable(
  "branch_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    branchId: uuid("branch_id")
      .references(() => branchesTable.id, { onDelete: "cascade" })
      .notNull(),

    alertThreshold: integer("alert_threshold").notNull().default(3),

    defaultLanguage: text("default_language").notNull().default("en"),

    whatsappTemplateId: text("whatsapp_template_id"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  /**
   * Table-level configurations. `unique(branchId)` ensures each branch
   * has at most one settings row.
   */
  table => ({
    branchUnique: unique("branch_settings_branch_id_unique").on(table.branchId)
  })
)

/** Drizzle type for inserting branch settings */
export type InsertBranchSettings = typeof branchSettingsTable.$inferInsert
/** Drizzle type for selecting branch settings */
export type SelectBranchSettings = typeof branchSettingsTable.$inferSelect
