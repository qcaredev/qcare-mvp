/**
 * @file consult-history-actions.ts
 *
 * @description
 * Server actions for managing the `consult_history` table. This includes
 * creating, and in the future, reading or deleting consultation history records.
 *
 * @see
 * - `db/schema/consult-history-schema.ts` for table and type definitions.
 */
"use server"

import { db } from "@/db/db"
import {
  consultHistoryTable,
  InsertConsultHistory,
  SelectConsultHistory
} from "@/db/schema"
import { ActionState } from "@/types"

/**
 * Defines a union type that can accept either the main Drizzle `db` client or
 * the client from within a `db.transaction(async (tx) => {})` block.
 * This allows the action to be composable and used within other transactions.
 */
type DbOrTxClient =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

// The input interface now uses the flexible DbOrTxClient type.
interface CreateHistoryInput {
  data: InsertConsultHistory
  tx?: DbOrTxClient
}

/**
 * @function createConsultHistoryAction
 * @description Creates a new record in the `consult_history` table. Can be
 * used within a larger database transaction by passing the transaction client.
 *
 * @param {CreateHistoryInput} { data, tx } - An object containing the data and
 * an optional Drizzle transaction client.
 *
 * @returns {Promise<ActionState<SelectConsultHistory>>} An `ActionState` object
 * containing the result of the operation.
 */
export async function createConsultHistoryAction({
  data,
  tx
}: CreateHistoryInput): Promise<ActionState<SelectConsultHistory>> {
  try {
    // Use the transaction client if it's passed, otherwise use the global db client.
    const dbClient = tx || db

    const [newHistory] = await dbClient
      .insert(consultHistoryTable)
      .values(data)
      .returning()

    return {
      isSuccess: true,
      message: "Consultation history created successfully.",
      data: newHistory
    }
  } catch (error) {
    console.error("Error creating consult history:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return {
      isSuccess: false,
      message: "Failed to create consultation history."
    }
  }
}