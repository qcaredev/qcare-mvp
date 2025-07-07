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
import { InsertQueueItem, queueItemsTable, SelectQueueItem } from "@/db/schema"
import { ActionState } from "@/types"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

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
