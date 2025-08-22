/**
 * @file clinic-settings-actions.ts
 *
 * @description
 * Server actions for managing the `clinic_settings` table. This includes
 * operations for creating, reading, and updating clinic-specific settings, such
 * as notification thresholds and language preferences.
 *
 * @dependencies
 * - `db/db.ts`: The Drizzle ORM client.
 * - `db/schema/clinic-settings-schema.ts`: For table and type definitions.
 * - `types/server-action-types.ts`: For the `ActionState` return type.
 */
"use server"

import { db } from "@/db/db"
import { clinicSettingsTable, SelectClinicSettings } from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

/**
 * A union type for the Drizzle client, allowing a function to be used
 * either standalone with the global `db` object or within a parent
 * transaction by accepting the `tx` client.
 */
type DbOrTxClient =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

/**
 * @function getClinicSettingsAction
 * @description Retrieves the settings for a specific clinic. If no settings row
 * exists for the clinic, it returns null, allowing the caller to use default values.
 *
 * @param {string} clinicId - The UUID of the clinic whose settings are being requested.
 * @param {DbOrTxClient} [tx] - (Optional) A Drizzle transaction client. If provided,
 * the query will be executed within that transaction.
 *
 * @returns {Promise<ActionState<SelectClinicSettings | null>>} An `ActionState` object.
 * - On success: `data` contains the clinic settings object or `null` if not found.
 * - On failure: `isSuccess` is false, and `message` contains the error details.
 */
export async function getClinicSettingsAction(
  clinicId: string,
  tx?: DbOrTxClient
): Promise<ActionState<SelectClinicSettings | null>> {
  try {
    const dbClient = tx || db

    const settings = await dbClient.query.clinicSettings.findFirst({
      where: eq(clinicSettingsTable.clinicId, clinicId)
    })

    return {
      isSuccess: true,
      message: "Clinic settings retrieved successfully.",
      data: settings || null
    }
  } catch (error) {
    console.error("Error retrieving clinic settings:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve clinic settings."
    }
  }
}
