/**
 * @file use-queue-mutations.ts
 *
 * @description
 * This is the corrected and robust custom hook for all queue mutations.
 * It uses Next.js's built-in `useTransition` for loading states and
 * `useRouter` to refresh data, ensuring the UI is always in sync with the
 * database after an action.
 */
"use client"

import {
  reorderQueueAction,
  updateQueueStatusAction
} from "@/actions/db/queue_items_actions"
import { queueStatusEnum } from "@/db/schema"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export function useQueueMutations() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const updateStatusMutation = (
    itemId: string,
    newStatus: (typeof queueStatusEnum.enumValues)[number]
  ) => {
    startTransition(async () => {
      const result = await updateQueueStatusAction(itemId, newStatus)

      if (result.isSuccess) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      
      // This is the critical line that was missing.
      // It tells Next.js to re-fetch the server data and update the UI.
      router.refresh()
    })
  }

  const reorderQueueMutation = (
    items: { id: string; position: number }[]
  ) => {
    startTransition(async () => {
      const result = await reorderQueueAction(items)

      if (result.isSuccess) {
        toast.success("Queue reordered successfully.")
      } else {
        toast.error(result.message)
      }
      
      // Also refresh data after reordering.
      router.refresh()
    })
  }

  return { isPending, updateStatusMutation, reorderQueueMutation }
}
