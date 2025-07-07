/**
 * @file queue-items-actions.ts
 *
 * @description
 * Server actions for managing the `queue_items` table. This includes operations
 * such as creating, reordering, and updating the status of queue items. These
 * actions encapsulate the database logic and are designed to be securely called
 * from client components.
 *
 * @see
 * - Drizzle ORM (`drizzle-orm`) for database queries.
 * - `db/schema/queue-items-schema.ts` for table and type definitions.
 * - `types/server-action-types.ts` for the `ActionState` return type.
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

// =================================================================================
// C R E A T E
// =================================================================================

/**
 * @function createQueueItemAction
 * @description Inserts a new patient record into the `queue_items` table.
 *
 * @param {CreateQueueItemInput} data - The patient details to be added.
 * @returns {Promise<ActionState<SelectQueueItem>>} An `ActionState` object.
 */
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
 * @function getQueueItemsByClinicAction
 * @description Retrieves all queue items for a given clinic for the current day.
 *
 * @param {string} clinicId - The UUID of the clinic.
 *
 * @returns {Promise<ActionState<SelectQueueItem[]>>} An `ActionState` object
 * containing an array of queue items.
 */
export async function getQueueItemsByClinicAction(
  clinicId: string
): Promise<ActionState<SelectQueueItem[]>> {
  try {
    const todayStart = startOfDay(new Date())

    const items = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.clinicId, clinicId),
        gte(queueItemsTable.createdAt, todayStart)
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

// =================================================================================
// U P D A T E
// =================================================================================

/**
 * @function reorderQueueAction
 * @description Updates the `position` for multiple items in the waitlist.
 *
 * @param {ReorderQueueItem[]} items - An array of items with their new positions.
 * @returns {Promise<ActionState<void>>} An `ActionState` object.
 */
export async function reorderQueueAction(
  items: ReorderQueueItem[]
): Promise<ActionState<void>> {
  try {
    await db.transaction(async tx => {
      const updatePromises = items.map(item =>
        tx
          .update(queueItemsTable)
          .set({ position: item.position })
          .where(eq(queueItemsTable.id, item.id))
      )
      await Promise.all(updatePromises)
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

/**
 * @function updateQueueStatusAction
 * @description Moves a queue item to a new status.
 *
 * @param {string} queueItemId - The ID of the item to update.
 * @param {SelectQueueItem["status"]} newStatus - The target status.
 * @returns {Promise<ActionState<SelectQueueItem>>} An `ActionState` object.
 */
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

        const historyResult = await createConsultHistoryAction(
          {
            queueItemId: currentItem.id,
            clinicId: currentItem.clinicId,
            waitDurationSeconds,
            consultDurationSeconds
          },
        )

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