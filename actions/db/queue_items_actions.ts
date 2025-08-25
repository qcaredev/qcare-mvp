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
 * - `actions/db/branch-settings-actions.ts`: For retrieving alert thresholds.
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
import { and, asc, desc, eq, gte } from "drizzle-orm"
import { startOfDay } from "date-fns"
import { revalidatePath } from "next/cache"
import { createConsultHistoryAction } from "./consult_history_actions"
import { getBranchSettingsAction } from "./branch-settings-actions"
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
 * The input type for registering a new patient, which includes all the
 * new fields from the registration form.
 */
export interface RegisterPatientInput {
  patientName: string
  phone?: string | null
  reason?: string | null
  branchId: string
  doctorId?: string | null
  age?: number | null
  height?: number | null
  weight?: number | null
  address?: string | null
}

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
 * @description Checks the waitlist for a given branch and sends "You're next" or
 * "You are N spots away" WhatsApp notifications to patients who have reached the
 * configured alert threshold.
 * @param {string} branchId - The ID of the branch to check.
 * @param {DbOrTxClient} tx - The Drizzle transaction client.
 */
async function checkAndSendProximityAlerts(
  branchId: string,
  tx: DbOrTxClient
) {
  try {
    // 1. Get branch-specific alert settings
    const settingsResult = await getBranchSettingsAction(branchId, tx)
    if (!settingsResult.isSuccess || !settingsResult.data) {
      console.error(
        `Could not retrieve settings for branch ${branchId}. Alerts will not be sent.`
      )
      return
    }
    const { alertThreshold } = settingsResult.data

    // 2. Get the current waitlist, up to the alert threshold
    const waitlist = await tx.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.branchId, branchId),
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

      if (position <= alertThreshold) {
        let messageBody = ""
        if (position === 1) {
          messageBody = "You are next – please check in at reception."
        } else {
          messageBody = `Your turn is near! You are now #${position} in the queue.`
        }

        // Asynchronously send the message; do not block the transaction.
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
            eq(queueItemsTable.branchId, data.branchId),
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

/**
 * @function registerPatientAction
 * @description Orchestrates the entire patient registration process. It creates the
 * queue item and then sends an initial WhatsApp notification with queue details.
 * @param {RegisterPatientInput} data - The patient's details from the registration form.
 * @returns {Promise<ActionState<SelectQueueItem>>} The result of the operation, containing the newly created queue item on success.
 */
export async function registerPatientAction(
  data: RegisterPatientInput
): Promise<ActionState<SelectQueueItem>> {
  // Step 1: Create the queue item in the database.
  const createResult = await createQueueItemAction(data)

  if (!createResult.isSuccess) {
    return createResult // Propagate the error message from the create action.
  }

  const newQueueItem = createResult.data

  // Step 2: If a phone number is provided, attempt to send a WhatsApp notification.
  if (newQueueItem.phone) {
    // Fetch the public details to get position and wait time for the message.
    const detailsResult = await getPublicQueueItemDetailsAction(newQueueItem.id)

    if (detailsResult.isSuccess) {
      const { position, estimatedWaitTimeMinutes } = detailsResult.data
      const welcomeMessage = `Welcome, ${newQueueItem.patientName}! Your estimated wait is ${estimatedWaitTimeMinutes} min and you are #${position} in line. View your status: ${process.env.NEXT_PUBLIC_BASE_URL}/q/${newQueueItem.id}`

      // Send the message. We don't block the main return path on this,
      // but we log errors if it fails.
      sendWhatsAppMessageAction({
        to: newQueueItem.phone,
        body: welcomeMessage
      }).then(notificationResult => {
        if (!notificationResult.isSuccess) {
          console.error(
            `Failed to send WhatsApp notification for queue item ${newQueueItem.id}: ${notificationResult.message}`
          )
        }
      })
    } else {
      console.error(
        `Could not fetch public details for new queue item ${newQueueItem.id} to send notification.`
      )
    }
  }

  // The primary action is successful even if the notification fails.
  return {
    isSuccess: true,
    message: "Patient registered successfully.",
    data: newQueueItem
  }
}

// =================================================================================
// R E A D
// =================================================================================

export interface PublicQueueDetails {
  queueItem: SelectQueueItem
  position: number
  estimatedWaitTimeMinutes: number
}

export async function getPublicQueueItemDetailsAction(
  queueItemId: string
): Promise<ActionState<PublicQueueDetails>> {
  try {
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

    const { branchId } = item

    const waitlist = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.branchId, branchId),
        eq(queueItemsTable.status, "WAITLIST")
      ),
      orderBy: [asc(queueItemsTable.position)]
    })

    const position = waitlist.findIndex(i => i.id === queueItemId)

    const sampleSize = parseInt(process.env.WAIT_ESTIMATE_SAMPLE_SIZE || "5")
    const recentConsults = await db
      .select({ duration: consultHistoryTable.consultDurationSeconds })
      .from(consultHistoryTable)
      .where(eq(consultHistoryTable.branchId, branchId))
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

export async function getQueueItemsByBranchAction(
  branchId: string
): Promise<ActionState<SelectQueueItem[]>> {
  try {
    const items = await db.query.queueItems.findMany({
      where: eq(queueItemsTable.branchId, branchId),
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
  branchId: string,
  doctorId: string
): Promise<ActionState<SelectQueueItem[]>> {
  try {
    const todayStart = startOfDay(new Date())
    const items = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.branchId, branchId),
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
        return
      }

      const updatePromises = items.map(item =>
        tx
          .update(queueItemsTable)
          .set({ position: item.position })
          .where(eq(queueItemsTable.id, item.id))
      )
      await Promise.all(updatePromises)

      const [firstItem] = await tx
        .select({ branchId: queueItemsTable.branchId })
        .from(queueItemsTable)
        .where(eq(queueItemsTable.id, items[0].id))
        .limit(1)

      if (firstItem && firstItem.branchId) {
        await checkAndSendProximityAlerts(firstItem.branchId, tx)
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
            branchId: currentItem.branchId,
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

      if (
        (newStatus === "COMPLETE" || newStatus === "CANCELLED") &&
        currentItem.status !== "COMPLETE" &&
        currentItem.status !== "CANCELLED"
      ) {
        await checkAndSendProximityAlerts(currentItem.branchId, tx)
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
