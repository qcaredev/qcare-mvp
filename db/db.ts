/**
 * @file db.ts
 *
 * @description
 *  Centralised Drizzle ORM client initialisation for Postgres, including a
 *  schema map so Drizzle can infer strongly‑typed query helpers.
 *
 *  ❗️Migrations are **not** generated here—follow the user instructions
 *  below to run `drizzle-kit`.
 */

import {
  branchesTable,
  branchSettingsTable,
  consultHistoryTable,
  profilesTable,
  queueItemsTable
} from "@/db/schema"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

config({ path: ".env.local" })

/**
 * The schema object must include every pgTable we intend to query through
 * `db.query.<table>` helpers.  Add new tables here whenever you create a
 * new schema file.
 */
const schema = {
  profiles: profilesTable,
  clinics: branchesTable,
  queueItems: queueItemsTable,
  consultHistory: consultHistoryTable,
  clinicSettings: branchSettingsTable
} as const

/**
 * Postgres connection using the DATABASE_URL environment variable.
 * `postgres()` returns a lazy client that opens the connection pool on
 * first query.
 */
const client = postgres(process.env.DATABASE_URL!, {
  idle_timeout: 60 // seconds – keep idle connections short for serverless
})

/**
 * Drizzle ORM instance—exported for use in server actions.
 */
export const db = drizzle(client, { schema })
