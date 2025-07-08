/**
 * @file clinic-settings-actions.ts
 *
 * @description
 * Server actions for creating, reading, and updating records in the
 * `clinic_settings` table. These actions provide a secure interface
 * for the admin settings form to interact with the database.
 */
"use server"

import { db } from "@/db/db"
import {
  clinicSettingsTable,
  InsertClinicSettings,
  SelectClinicSettings
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/**
 * @function getClinicSettingsAction
 * @description Retrieves the settings for a specific clinic.
 *
 * @param {string} clinicId - The UUID of the clinic.
 * @returns {Promise<ActionState<SelectClinicSettings | null>>} The settings object, or null if none exists.
 */
export async function getClinicSettingsAction(
  clinicId: string
): Promise<ActionState<SelectClinicSettings | null>> {
  try {
    const settings = await db.query.clinicSettings.findFirst({
      where: eq(clinicSettingsTable.clinicId, clinicId)
    })
    return {
      isSuccess: true,
      message: "Settings retrieved.",
      data: settings || null
    }
  } catch (error) {
    console.error("Error getting clinic settings:", error)
    return { isSuccess: false, message: "Failed to retrieve settings." }
  }
}

/**
 * @function updateClinicSettingsAction
 * @description Creates or updates the settings for a specific clinic (upsert).
 * This function uses Drizzle's `.onConflictDoUpdate()` to atomically update
 * the record if it exists, or insert it if it does not.
 *
 * @param {InsertClinicSettings} settings - The settings data to save.
 * @returns {Promise<ActionState<SelectClinicSettings>>} The updated settings object.
 */
export async function updateClinicSettingsAction(
  settings: InsertClinicSettings
): Promise<ActionState<SelectClinicSettings>> {
  try {
    const [updatedSettings] = await db
      .insert(clinicSettingsTable)
      .values(settings)
      .onConflictDoUpdate({
        target: clinicSettingsTable.clinicId, // The column with the unique constraint
        set: {
          alertThreshold: settings.alertThreshold,
          defaultLanguage: settings.defaultLanguage,
          whatsappTemplateId: settings.whatsappTemplateId
        }
      })
      .returning()

    // Revalidate the admin path to ensure the UI shows the updated settings
    revalidatePath("/admin")

    return {
      isSuccess: true,
      message: "Settings updated successfully.",
      data: updatedSettings
    }
  } catch (error) {
    console.error("Error updating clinic settings:", error)
    return { isSuccess: false, message: "Failed to update settings." }
  }
}
