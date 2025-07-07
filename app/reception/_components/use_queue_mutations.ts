/**
 * @file use-queue-mutations.ts
 *
 * @description
 * This custom hook encapsulates the logic for calling server actions that
 * mutate queue data. It centralizes server communication and user feedback
 * (via toasts) for operations like updating a patient's status or reordering
 * the queue.
 *
 * @dependencies
 * - `react`: For `useCallback` and `useTransition` for managing pending states.
 * - `sonner`: For displaying toast notifications.
 * - `@/actions/db/queue-items-actions`: The server actions to be called.
 */
"use client"

import {
  reorderQueueAction,
  updateQueueStatusAction
} from "@/actions/db/queue_items_actions"
import { queueStatusEnum } from "@/db/schema"
import { useCallback } from "react"
import { toast } from "sonner"

export function useQueueMutations() {
  const updateStatusMutation = useCallback(
    async (
      itemId: string,
      newStatus: (typeof queueStatusEnum.enumValues)[number]
    ) => {
      toast.loading(`Moving patient to ${newStatus.toLowerCase()}...`)

      const result = await updateQueueStatusAction(itemId, newStatus)

      if (result.isSuccess) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    },
    []
  )

  const reorderQueueMutation = useCallback(
    async (items: { id: string; position: number }[]) => {
      toast.loading("Reordering queue...")

      const result = await reorderQueueAction(items)

      if (result.isSuccess) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    },
    []
  )

  return { updateStatusMutation, reorderQueueMutation }
}
