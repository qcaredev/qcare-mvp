/**
 * @file branch-settings-actions.ts
 *
 * @description
 * Server actions for managing the `branch_settings` table. This includes creating,
 * reading, and updating settings for a specific branch.
 *
 * @dependencies
 * - `drizzle-orm`: For database queries.
 * - `db/db.ts`: The Drizzle client.
 * - `db/schema`: For table and type definitions.
 * - `types`: For the `ActionState` return type.
 */
"use server"

import { db } from "@/db/db"
import {
  branchSettingsTable,
  InsertBranchSettings,
  SelectBranchSettings
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type DbOrTxClient =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

// =================================================================================
// C R E A T E
// =================================================================================

export async function createBranchSettingsAction(
  data: InsertBranchSettings
): Promise<ActionState<SelectBranchSettings>> {
  try {
    const [newSettings] = await db
      .insert(branchSettingsTable)
      .values(data)
      .returning()

    return {
      isSuccess: true,
      message: "Branch settings created successfully.",
      data: newSettings
    }
  } catch (error) {
    console.error("Error creating branch settings:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return {
      isSuccess: false,
      message: "Failed to create branch settings."
    }
  }
}

// =================================================================================
// R E A D
// =================================================================================

export async function getBranchSettingsAction(
  branchId: string,
  tx?: DbOrTxClient
): Promise<ActionState<SelectBranchSettings>> {
  try {
    const dbClient = tx || db
    const settings = await dbClient.query.branchSettings.findFirst({
      where: eq(branchSettingsTable.branchId, branchId)
    })

    if (!settings) {
      return { isSuccess: false, message: "Settings not found for this branch." }
    }

    return {
      isSuccess: true,
      message: "Branch settings retrieved.",
      data: settings
    }
  } catch (error) {
    console.error("Error retrieving branch settings:", error)
    return { isSuccess: false, message: "Failed to retrieve branch settings." }
  }
}

// =================================================================================
// U P D A T E
// =================================================================================

export async function updateBranchSettingsAction(
  branchId: string,
  data: Partial<Omit<InsertBranchSettings, "branchId">>
): Promise<ActionState<SelectBranchSettings>> {
  try {
    const [updatedSettings] = await db
      .update(branchSettingsTable)
      .set(data)
      .where(eq(branchSettingsTable.branchId, branchId))
      .returning()

    if (!updatedSettings) {
      return { isSuccess: false, message: "Settings not found to update." }
    }

    revalidatePath("/admin")

    return {
      isSuccess: true,
      message: "Settings updated successfully.",
      data: updatedSettings
    }
  } catch (error) {
    console.error("Error updating branch settings:", error)
    return { isSuccess: false, message: "Failed to update settings." }
  }
}