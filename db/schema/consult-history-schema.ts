/**
 * @file consult-history-schema.ts
 *
 * @description
 *  Drizzle ORM table definition for **`consult_history`**.
 *  Each row captures timing metrics once a consultation finishes,
 *  enabling analytics without scanning the volatile `queue_items`.
 *
 * @columns
 *  - queueItemId : FK to the source queue item (CASCADE on delete)
 *  - clinicId    : Tenant, duplicative for faster analytics queries
 *  - waitDurationSeconds
 *  - consultDurationSeconds
 *  - createdAt / updatedAt : Audit
 *
 * @notes
 *  - We duplicate `clinicId` for composite indexing and because
 *    `queue_items` may be removed after 30 days retention.
 */

import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"

import { clinicsTable } from "./clinics-schema"
import { queueItemsTable } from "./queue-items-schema"

export const consultHistoryTable = pgTable("consult_history", {
  id: uuid("id").defaultRandom().primaryKey(),

  /** Original queue item for traceability */
  queueItemId: uuid("queue_item_id")
    .references(() => queueItemsTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Tenant reference (duplicated for faster aggregation) */
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
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

export type InsertConsultHistory = typeof consultHistoryTable.$inferInsert
export type SelectConsultHistory = typeof consultHistoryTable.$inferSelect
