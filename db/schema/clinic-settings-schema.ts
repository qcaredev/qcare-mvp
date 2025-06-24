/**
 * @file clinic-settings-schema.ts
 *
 * @description
 *  Drizzle ORM table definition for **`clinic_settings`**.
 *  Holds user‑configurable behaviour such as WhatsApp alert thresholds.
 *
 * @columns
 *  - clinicId (FK)          : The owning clinic (unique)
 *  - alertThreshold         : Integer (# patients away to trigger alert)
 *  - defaultLanguage        : Text (e.g., 'en' | 'hi')
 *  - whatsappTemplateId     : Twilio template reference
 *  - createdAt / updatedAt  : Audit
 *
 * @rules
 *  - Exactly **one row per clinic** enforced via a unique constraint.
 */

import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  unique
} from "drizzle-orm/pg-core"

import { clinicsTable } from "./clinics-schema"

export const clinicSettingsTable = pgTable(
  "clinic_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    clinicId: uuid("clinic_id")
      .references(() => clinicsTable.id, { onDelete: "cascade" })
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
   * Table‑level configurations (constraints, indexes).
   * `unique(clinicId)` makes sure each clinic has at most one settings row.
   */
  table => ({
    clinicUnique: unique("clinic_settings_clinic_id_unique").on(table.clinicId)
  })
)

export type InsertClinicSettings = typeof clinicSettingsTable.$inferInsert
export type SelectClinicSettings = typeof clinicSettingsTable.$inferSelect
