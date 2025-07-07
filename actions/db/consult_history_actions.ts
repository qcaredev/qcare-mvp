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

// This type alias improves readability for the optional transaction client parameter.
type TransactionClient = typeof db

/**
 * @function createConsultHistoryAction
 * @description Creates a new record in the `consult_history` table. Can be
 * used within a larger database transaction by passing the transaction client.
 *
 * @param {InsertConsultHistory} data - The consultation metrics to log.
 * @param {TransactionClient} [tx] - (Optional) The Drizzle transaction client.
 * If provided, the action will use this client instead of the global one,
 * making it part of the ongoing transaction.
 *
 * @returns {Promise<ActionState<SelectConsultHistory>>} An `ActionState` object
 * containing the result of the operation.
 */
export async function createConsultHistoryAction(
  data: InsertConsultHistory,
  tx?: TransactionClient
): Promise<ActionState<SelectConsultHistory>> {
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
