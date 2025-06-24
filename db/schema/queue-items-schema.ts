/**
 * @file queue-items-schema.ts
 *
 * @description
 *  Drizzle ORM table definition for **`queue_items`**. Each row represents
 *  a patient currently (or previously) in an OPD queue.
 *
 *  The table supports real‑time updates via Supabase Realtime, so we set
 *  `replica identity full` in Step 1.2 SQL instructions.
 *
 * @columns
 *  - id, clinicId              : Identification & tenancy
 *  - patientName, phone        : Patient contact details
 *  - reason                    : Reason for visit / chief complaint
 *  - status (enum)             : WAITLIST | SERVING | COMPLETE | CANCELLED
 *  - position                  : Integer ordering within WAITLIST
 *  - doctorId                  : Optional textual identifier for doctor
 *  - createdAt / updatedAt     : Audit timestamps
 *
 * @relations
 *  - FK clinicId ➔ clinics.id   (ON DELETE CASCADE)
 *
 * @business‑rules
 *  - `position` is only meaningful when `status = WAITLIST`.
 *  - `phone` is optional because some walk‑ins may not provide a number.
 */

import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core"

import { clinicsTable } from "./clinics-schema"

/** Status enumeration as per functional spec */
export const queueStatusEnum = pgEnum("queue_status", [
  "WAITLIST",
  "SERVING",
  "COMPLETE",
  "CANCELLED"
])

export const queueItemsTable = pgTable("queue_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  /** Tenant reference — cascades on clinic deletion */
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Patient‑facing fields */
  patientName: text("patient_name").notNull(),
  phone: text("phone"), // Optional

  /** Chief complaint / reason for visit */
  reason: text("reason"),

  /** Current queue status; default is WAITLIST */
  status: queueStatusEnum("status").notNull().default("WAITLIST"),

  /**
   * Display ordering inside WAITLIST.
   * IMPORTANT: Managed exclusively by server actions that enforce a dense
   * ranking (0‑n without gaps) to simplify “position” math.
   */
  position: integer("position").notNull().default(0),

  /**
   * The doctor the patient is eventually assigned to.
   * We store the Clerk/Supabase userId or any identifier string.
   */
  doctorId: text("doctor_id"),

  /** Audit fields */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/** Insert type for `queueItemsTable` */
export type InsertQueueItem = typeof queueItemsTable.$inferInsert
/** Select type for `queueItemsTable` */
export type SelectQueueItem = typeof queueItemsTable.$inferSelect
