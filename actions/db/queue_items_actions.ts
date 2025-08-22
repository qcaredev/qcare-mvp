/**
 * @file queue-items-actions.ts
 *
 * @description
 * Server actions for managing the `queue_items` table. This includes operations
 * such as creating, reordering, and updating the status of queue items. These
 * actions encapsulate the database logic and are designed to be securely called
 * from client components. This file now also includes logic to trigger proximity
 * alerts via WhatsApp.
 *
 * @dependencies
 * - `drizzle-orm`: For database queries.
 * - `db/schema/queue-items-schema.ts`: For table and type definitions.
 * - `types/server-action-types.ts`: For the `ActionState` return type.
 * - `actions/twilio-actions.ts`: For sending WhatsApp messages.
 * - `actions/db/clinic-settings-actions.ts`: For retrieving alert thresholds.
 */
"use server"

import { db } from "@/db/db"
import {
  consultHistoryTable,
  InsertQueueItem,
  queueItemsTable,
  queueStatusEnum,
  SelectQueueItem
} from "@/db/schema"
import { ActionState } from "@/types"
import { and, asc, desc, eq, gte, sql } from "drizzle-orm"
import { startOfDay } from "date-fns"
import { revalidatePath } from "next/cache"
import { createConsultHistoryAction } from "./consult_history_actions"
import { getClinicSettingsAction } from "./clinic-settings-actions"
import { sendWhatsAppMessageAction } from "@/actions/twilio-actions"

/**
 * The input type for creating a new queue item, omitting fields that are
 * managed by the server (e.g., id, status, position).
 */
type CreateQueueItemInput = Omit<
  InsertQueueItem,
  "id" | "status" | "position" | "createdAt" | "updatedAt"
>

/**
 * The input type for reordering items, specifying the unique identifier
 * and the new desired position for each item.
 */
interface ReorderQueueItem {
  id: string
  position: number
}

/**
 * A union type for the Drizzle client, allowing helper functions to be used
 * either standalone or within a transaction.
 */
type DbOrTxClient =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

// =================================================================================
// H E L P E R S
// =================================================================================

/**
 * @function checkAndSendProximityAlerts
 * @description Checks the waitlist for a given clinic and sends "You're next" or
 * "You are N spots away" WhatsApp notifications to patients who have reached the
 * configured alert threshold. This function is designed to be called within a
 * transaction after queue positions have changed.
 *
 * @param {string} clinicId - The ID of the clinic to check.
 * @param {DbOrTxClient} tx - The Drizzle transaction client.
 *
 * @notes
 * - This function does not return a value and swallows its own errors to prevent
 * failing the parent database transaction. It logs errors internally.
 * - It fetches the `alertThreshold` from `clinicSettingsTable`.
 * - For MVP, this function does not track if a notification has already been
 * sent for a specific position. This means a user might receive the same
 * alert multiple times. A future improvement would be to add a `lastNotifiedPosition`
 * column to the `queue_items` table to prevent this.
 */
async function checkAndSendProximityAlerts(
  clinicId: string,
  tx: DbOrTxClient
) {
  try {
    // 1. Get clinic-specific alert settings
    const settingsResult = await getClinicSettingsAction(clinicId, tx)
    if (!settingsResult.isSuccess || !settingsResult.data) {
      console.error(
        `Could not retrieve settings for clinic ${clinicId}. Alerts will not be sent.`
      )
      return
    }
    const { alertThreshold } = settingsResult.data

    // 2. Get the current waitlist, up to the alert threshold
    const waitlist = await tx.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.clinicId, clinicId),
        eq(queueItemsTable.status, "WAITLIST")
      ),
      orderBy: [asc(queueItemsTable.position)],
      limit: alertThreshold // Only fetch patients within the alert range
    })

    // 3. Iterate and send alerts
    for (const patient of waitlist) {
      if (!patient.phone) {
        continue // Cannot notify without a phone number
      }

      const position = patient.position + 1 // Display as 1-based index

      // Check if patient is within the notification threshold
      if (position <= alertThreshold) {
        let messageBody = ""
        if (position === 1) {
          messageBody = "You are next – please check in at reception."
        } else {
          messageBody = `Your turn is near! You are now #${position} in the queue.`
        }

        // Asynchronously send the message; do not block the transaction.
        // If this fails, it will be logged but will not cause a rollback.
        sendWhatsAppMessageAction({
          to: patient.phone,
          body: messageBody
        }).then(result => {
          if (!result.isSuccess) {
            console.error(
              `Failed to send proximity alert to ${patient.phone}: ${result.message}`
            )
          }
        })
      }
    }
  } catch (error) {
    console.error("Error during proximity alert check:", error)
  }
}

// =================================================================================
// C R E A T E
// =================================================================================

export async function createQueueItemAction(
  data: CreateQueueItemInput
): Promise<ActionState<SelectQueueItem>> {
  try {
    const newQueueItem = await db.transaction(async tx => {
      const [lastQueueItem] = await tx
        .select({ position: queueItemsTable.position })
        .from(queueItemsTable)
        .where(
          and(
            eq(queueItemsTable.clinicId, data.clinicId),
            eq(queueItemsTable.status, "WAITLIST")
          )
        )
        .orderBy(desc(queueItemsTable.position))
        .limit(1)

      const newPosition = lastQueueItem ? lastQueueItem.position + 1 : 0

      const [insertedItem] = await tx
        .insert(queueItemsTable)
        .values({
          ...data,
          status: "WAITLIST",
          position: newPosition
        })
        .returning()

      return insertedItem
    })

    revalidatePath("/reception")

    return {
      isSuccess: true,
      message: "Patient added to queue successfully.",
      data: newQueueItem
    }
  } catch (error) {
    console.error("Error creating queue item:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return { isSuccess: false, message: "Failed to add patient to the queue." }
  }
}

// =================================================================================
// R E A D
// =================================================================================

/**
 * The shape of the data returned for the public patient-facing queue page.
 */
export interface PublicQueueDetails {
  queueItem: SelectQueueItem
  position: number
  estimatedWaitTimeMinutes: number
}

export async function getPublicQueueItemDetailsAction(
  queueItemId: string
): Promise<ActionState<PublicQueueDetails>> {
  try {
    // 1. Fetch the specific patient's queue item
    const [item] = await db
      .select()
      .from(queueItemsTable)
      .where(eq(queueItemsTable.id, queueItemId))

    if (!item) {
      return { isSuccess: false, message: "Queue entry not found." }
    }

    if (item.status !== "WAITLIST") {
      return {
        isSuccess: false,
        message: `Your consultation status is: ${item.status}.`
      }
    }

    const { clinicId } = item

    // 2. Fetch all patients in the waitlist for that clinic to determine position
    const waitlist = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.clinicId, clinicId),
        eq(queueItemsTable.status, "WAITLIST")
      ),
      orderBy: [asc(queueItemsTable.position)]
    })

    const position = waitlist.findIndex(i => i.id === queueItemId)

    // 3. Calculate estimated wait time based on recent consultations
    const sampleSize = parseInt(process.env.WAIT_ESTIMATE_SAMPLE_SIZE || "5")
    const recentConsults = await db
      .select({ duration: consultHistoryTable.consultDurationSeconds })
      .from(consultHistoryTable)
      .where(eq(consultHistoryTable.clinicId, clinicId))
      .orderBy(desc(consultHistoryTable.createdAt))
      .limit(sampleSize)

    let avgConsultTimeSeconds = 15 * 60 // Default to 15 mins
    if (recentConsults.length > 0) {
      const totalDuration = recentConsults.reduce(
        (sum, consult) => sum + consult.duration,
        0
      )
      avgConsultTimeSeconds = totalDuration / recentConsults.length
    }

    const estimatedWaitTimeMinutes = Math.round(
      (position * avgConsultTimeSeconds) / 60
    )

    return {
      isSuccess: true,
      message: "Queue details retrieved.",
      data: {
        queueItem: item,
        position: position + 1, // Return 1-based index for display
        estimatedWaitTimeMinutes
      }
    }
  } catch (error) {
    console.error("Error getting public queue details:", error)
    return { isSuccess: false, message: "Failed to retrieve queue details." }
  }
}

export async function getQueueItemsByClinicAction(
  clinicId: string
): Promise<ActionState<SelectQueueItem[]>> {
  try {
    const todayStart = startOfDay(new Date())

    const items = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.clinicId, clinicId)
        // gte(queueItemsTable.createdAt, todayStart)
      ),
      orderBy: [asc(queueItemsTable.status), asc(queueItemsTable.position)]
    })

    return {
      isSuccess: true,
      message: "Queue items retrieved successfully.",
      data: items
    }
  } catch (error) {
    console.error("Error retrieving queue items:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return { isSuccess: false, message: "Failed to retrieve queue items." }
  }
}

export async function getQueueItemsByDoctorIdAction(
  clinicId: string,
  doctorId: string
): Promise<ActionState<SelectQueueItem[]>> {
  try {
    const todayStart = startOfDay(new Date())
    const items = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.clinicId, clinicId),
        eq(queueItemsTable.doctorId, doctorId),
        eq(queueItemsTable.status, "WAITLIST"),
        gte(queueItemsTable.createdAt, todayStart)
      ),
      orderBy: [asc(queueItemsTable.position)]
    })

    return {
      isSuccess: true,
      message: `Queue for Dr. ${doctorId} retrieved successfully.`,
      data: items
    }
  } catch (error) {
    console.error("Error retrieving doctor's queue items:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return { isSuccess: false, message: "Failed to retrieve doctor's queue." }
  }
}

// =================================================================================
// U P D A T E
// =================================================================================

export async function reorderQueueAction(
  items: ReorderQueueItem[]
): Promise<ActionState<void>> {
  try {
    await db.transaction(async tx => {
      if (items.length === 0) {
        return // No items to reorder, exit transaction.
      }

      const updatePromises = items.map(item =>
        tx
          .update(queueItemsTable)
          .set({ position: item.position })
          .where(eq(queueItemsTable.id, item.id))
      )
      await Promise.all(updatePromises)

      // To check for alerts, we need the clinicId. We can get it from any
      // of the items being moved.
      const [firstItem] = await tx
        .select({ clinicId: queueItemsTable.clinicId })
        .from(queueItemsTable)
        .where(eq(queueItemsTable.id, items[0].id))
        .limit(1)

      // If the item exists, trigger the proximity alert check.
      if (firstItem && firstItem.clinicId) {
        await checkAndSendProximityAlerts(firstItem.clinicId, tx)
      }
    })

    revalidatePath("/reception")

    return {
      isSuccess: true,
      message: "Queue reordered successfully.",
      data: undefined
    }
  } catch (error) {
    console.error("Error reordering queue:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return { isSuccess: false, message: "Failed to reorder the queue." }
  }
}

export async function updateQueueStatusAction(
  queueItemId: string,
  newStatus: (typeof queueStatusEnum.enumValues)[number]
): Promise<ActionState<SelectQueueItem>> {
  try {
    const updatedItem = await db.transaction(async tx => {
      const [currentItem] = await tx
        .select()
        .from(queueItemsTable)
        .where(eq(queueItemsTable.id, queueItemId))

      if (!currentItem) {
        throw new Error("Queue item not found.")
      }

      if (newStatus === "COMPLETE" && currentItem.status === "SERVING") {
        const completionTime = new Date()
        const consultStartTime = currentItem.updatedAt
        const registrationTime = currentItem.createdAt

        const waitDurationSeconds = Math.round(
          (consultStartTime.getTime() - registrationTime.getTime()) / 1000
        )
        const consultDurationSeconds = Math.round(
          (completionTime.getTime() - consultStartTime.getTime()) / 1000
        )

        const historyResult = await createConsultHistoryAction({
          data: {
            queueItemId: currentItem.id,
            clinicId: currentItem.clinicId,
            waitDurationSeconds,
            consultDurationSeconds
          },
          tx
        })

        if (!historyResult.isSuccess) {
          throw new Error(
            `Failed to log consultation history: ${historyResult.message}`
          )
        }
      }

      const newPosition =
        newStatus === "COMPLETE" || newStatus === "CANCELLED"
          ? -1
          : currentItem.position

      const [updated] = await tx
        .update(queueItemsTable)
        .set({ status: newStatus, position: newPosition })
        .where(eq(queueItemsTable.id, queueItemId))
        .returning()

      // Trigger alerts if a patient's removal affects the waitlist.
      if (
        (newStatus === "COMPLETE" || newStatus === "CANCELLED") &&
        currentItem.status !== "COMPLETE" &&
        currentItem.status !== "CANCELLED"
      ) {
        await checkAndSendProximityAlerts(currentItem.clinicId, tx)
      }

      return updated
    })

    if (!updatedItem) {
      return { isSuccess: false, message: "Could not update queue item." }
    }

    revalidatePath("/reception")
    revalidatePath("/doctor")

    return {
      isSuccess: true,
      message: `Status updated successfully to ${newStatus}.`,
      data: updatedItem
    }
  } catch (error) {
    console.error("Error updating queue status:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return {
      isSuccess: false,
      message: "An unknown error occurred while updating status."
    }
  }
}
