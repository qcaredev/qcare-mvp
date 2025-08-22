/**
 * @file consult-history-schema.ts
 *
 * @description
 * Drizzle ORM table definition for **`consult_history`**.
 * Each row captures timing metrics once a consultation finishes at a branch,
 * enabling analytics without scanning the volatile `queue_items`.
 *
 * @columns
 * - queueItemId           : FK to the source queue item.
 * - branchId              : Tenant, for faster analytics queries.
 * - waitDurationSeconds   : Time from registration to consult start.
 * - consultDurationSeconds: Time from consult start to completion.
 * - createdAt             : Audit timestamp.
 *
 * @notes
 * - We use `branchId` for composite indexing and because `queue_items`
 * may have a different retention policy.
 */
// "use server"

import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { branchesTable } from "./branches-schema"
import { queueItemsTable } from "./queue-items-schema"

export const consultHistoryTable = pgTable("consult_history", {
  id: uuid("id").defaultRandom().primaryKey(),

  /** Original queue item for traceability */
  queueItemId: uuid("queue_item_id")
    .references(() => queueItemsTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Tenant reference (for faster aggregation) */
  branchId: uuid("branch_id")
    .references(() => branchesTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Time between registration and consult start, in seconds */
  waitDurationSeconds: integer("wait_duration_seconds").notNull(),

  /** Time between consult start and completion, in seconds */
  consultDurationSeconds: integer("consult_duration_seconds").notNull(),

  /** Audit timestamps */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/** Drizzle type for inserting consultation history */
export type InsertConsultHistory = typeof consultHistoryTable.$inferInsert
/** Drizzle type for selecting consultation history */
export type SelectConsultHistory = typeof consultHistoryTable.$inferSelect
