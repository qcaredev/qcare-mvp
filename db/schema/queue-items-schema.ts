/**
 * @file queue-items-schema.ts
 *
 * @description
 * Drizzle ORM table definition for **`queue_items`**. Each row represents
 * a patient currently (or previously) in an OPD queue for a specific branch.
 *
 * @columns
 * - id, branchId            : Identification & tenancy.
 * - patientName, phone, age, etc. : Patient details.
 * - reason                 : Reason for visit / chief complaint.
 * - status (enum)          : WAITLIST | SERVING | COMPLETE | CANCELLED.
 * - position               : Integer ordering within WAITLIST.
 * - doctorId               : Optional textual identifier for doctor.
 * - createdAt / updatedAt  : Audit timestamps.
 *
 * @relations
 * - FK branchId ➔ branches.id (ON DELETE CASCADE)
 */
// "use server"

import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { branchesTable } from "./branches-schema"

/** Status enumeration as per functional spec */
export const queueStatusEnum = pgEnum("queue_status", [
  "WAITLIST",
  "SERVING",
  "COMPLETE",
  "CANCELLED",
])

export const queueItemsTable = pgTable("queue_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  /** Tenant reference — cascades on branch deletion */
  branchId: uuid("branch_id")
    .references(() => branchesTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Patient-facing fields */
  patientName: text("patient_name").notNull(),
  phone: text("phone"),
  age: integer("age"),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  address: text("address"),

  /** Chief complaint / reason for visit */
  reason: text("reason"),

  /** Current queue status; default is WAITLIST */
  status: queueStatusEnum("status").notNull().default("WAITLIST"),

  /**
   * Display ordering inside WAITLIST.
   * IMPORTANT: Managed exclusively by server actions that enforce a dense
   * ranking (0-n without gaps) to simplify “position” math.
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
    .$onUpdate(() => new Date()),
})

/** Drizzle type for inserting a queue item */
export type InsertQueueItem = typeof queueItemsTable.$inferInsert
/** Drizzle type for selecting a queue item */
export type SelectQueueItem = typeof queueItemsTable.$inferSelect
