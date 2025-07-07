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
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createConsultHistoryAction } from "./consult-history-actions"

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
 * - `clinicId`: The UUID of the clinic this patient belongs to.
 * - `patientName`: The name of the patient.
 * - `phone`: (Optional) The patient's phone number.
 * - `reason`: (Optional) The reason for the visit.
 * - `doctorId`: (Optional) The identifier for the assigned doctor.
 *
 * @returns {Promise<ActionState<SelectQueueItem>>} An `ActionState` object.
 * - On success: `{ isSuccess: true, message: "...", data: newQueueItem }`
 * - On failure: `{ isSuccess: false, message: "..." }`
 *
 * @logic
 * 1. It runs inside a database transaction to ensure atomicity.
 * 2. It calculates the new patient's position by finding the maximum
 * current `position` for the clinic's `WAITLIST` and adding 1.
 * If the queue is empty, the position starts at 0.
 * 3. It inserts the new record with a default `status` of `WAITLIST` and
 * the calculated `position`.
 * 4. After a successful insert, it triggers a revalidation of the reception
 * page to reflect the new data.
 */
export async function createQueueItemAction(
  data: CreateQueueItemInput
): Promise<ActionState<SelectQueueItem>> {
  try {
    // A transaction ensures that finding the last position and inserting the
    // new item are performed as a single, atomic operation. This prevents
    // race conditions if multiple users add patients simultaneously.
    const newQueueItem = await db.transaction(async tx => {
      // Find the item with the highest position in the waitlist for this clinic.
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

      // The new position is the last position + 1, or 0 if the queue is empty.
      const newPosition = lastQueueItem ? lastQueueItem.position + 1 : 0

      // Insert the new patient into the queue with the calculated position
      // and default status.
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

    // Revalidate the path to ensure the UI updates with the new item.
    // This is important for Server Components that fetch this data.
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
// U P D A T E
// =================================================================================

/**
 * @function reorderQueueAction
 * @description Updates the `position` for multiple items in the waitlist. This
 * is used for drag-and-drop functionality on the reception Kanban board.
 *
 * @param {ReorderQueueItem[]} items - An array of objects, each containing an
 * `id` and a new `position`.
 *
 * @returns {Promise<ActionState<void>>} An `ActionState` object.
 * - On success: `{ isSuccess: true, message: "...", data: undefined }`
 * - On failure: `{ isSuccess: false, message: "..." }`
 *
 * @logic
 * 1. It runs inside a database transaction (`db.transaction`) to ensure that all
 * updates succeed or none do. This prevents the queue from becoming corrupted.
 * 2. It iterates through the input array of items and creates an `update` promise
 * for each one.
 * 3. `Promise.all` executes all update promises concurrently within the transaction.
 * 4. If the transaction commits successfully, it revalidates the `/reception`
 * path to trigger a UI update.
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
 * @description Moves a queue item to a new status (e.g., WAITLIST -> SERVING).
 * If the new status is 'COMPLETE', it logs the wait and consult durations
 * to the `consult_history` table.
 *
 * @param {string} queueItemId - The ID of the item to update.
 * @param {SelectQueueItem["status"]} newStatus - The target status.
 *
 * @returns {Promise<ActionState<SelectQueueItem>>} An `ActionState` object with the updated item.
 *
 * @logic
 * 1.  Runs within a database transaction for atomicity.
 * 2.  Fetches the item to ensure it exists and to get its timestamps.
 * 3.  **If `newStatus` is 'COMPLETE'**:
 * - It calculates `waitDurationSeconds` and `consultDurationSeconds`.
 * - `waitDuration` is the time from `createdAt` to `updatedAt` (when it was moved to `SERVING`).
 * - `consultDuration` is the time from `updatedAt` to `now()`.
 * - It calls `createConsultHistoryAction` to log these metrics, passing the transaction client `tx`.
 * - If logging fails, it throws an error to abort the transaction.
 * 4.  Updates the item's status and potentially its position (sets to -1 for terminal states).
 * 5.  Revalidates relevant paths (`/reception`, `/doctor`) to update UI.
 */
export async function updateQueueStatusAction(
  queueItemId: string,
  newStatus: (typeof queueStatusEnum.enumValues)[number]
): Promise<ActionState<SelectQueueItem>> {
  try {
    const updatedItem = await db.transaction(async tx => {
      // Step 1: Fetch the current item to get its state before the update.
      const [currentItem] = await tx
        .select()
        .from(queueItemsTable)
        .where(eq(queueItemsTable.id, queueItemId))

      if (!currentItem) {
        throw new Error("Queue item not found.")
      }

      // Step 2: If moving from SERVING to COMPLETE, log consultation history.
      if (newStatus === "COMPLETE" && currentItem.status === "SERVING") {
        const completionTime = new Date()
        const consultStartTime = currentItem.updatedAt // This is the time it was moved to SERVING
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
          tx // Pass the transaction client to ensure atomicity
        )

        if (!historyResult.isSuccess) {
          // If logging fails, the transaction will be rolled back automatically.
          throw new Error(
            `Failed to log consultation history: ${historyResult.message}`
          )
        }
      }

      // Step 3: Update the queue item's status.
      // For terminal states, set position to -1 to remove from active queue views.
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

    // Step 4: Revalidate paths to reflect the change in the UI.
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
