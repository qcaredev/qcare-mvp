/**
 * @file use-queue-mutations.ts
 * @description This custom hook centralizes the client-side logic for calling
 * server actions that mutate the patient queue. It provides functions to update
 * a patient's status, reorder the waitlist, and send notifications.
 *
 * @dependencies
 * - `react`: For the useTransition hook.
 * - `next/navigation`: For the useRouter hook to refresh server component data.
 * - `sonner`: For displaying toast notifications.
 * - `actions/*`: For the server actions themselves.
 */
"use client"

import {
  reorderQueueAction,
  updateQueueStatusAction
} from "@/actions/db/queue_items_actions"
import { sendWhatsAppMessageAction } from "@/actions/twilio-actions"
import { queueStatusEnum } from "@/db/schema"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export function useQueueMutations() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  /**
   * @function handleUpdateStatus
   * @description A wrapper function to call the `updateQueueStatusAction`.
   */
  const handleUpdateStatus = (
    queueItemId: string,
    newStatus: (typeof queueStatusEnum.enumValues)[number]
  ) => {
    startTransition(async () => {
      const result = await updateQueueStatusAction(queueItemId, newStatus)
      if (result.isSuccess) {
        toast.success(result.message)
        router.refresh() // Refresh server-fetched data
      } else {
        toast.error(result.message)
      }
    })
  }

  /**
   * @function handleReorderItems
   * @description A wrapper function to call the `reorderQueueAction`.
   */
  const handleReorderItems = (
    items: { id: string; position: number }[]
  ) => {
    startTransition(async () => {
      const result = await reorderQueueAction(items)
      if (result.isSuccess) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      // We refresh regardless of success to ensure UI consistency with DB
      router.refresh()
    })
  }

  /**
   * @function handleNotify
   * @description Calls the action to send a "You're next" WhatsApp reminder.
   */
  const handleNotify = (phone: string, patientName: string) => {
    startTransition(async () => {
      toast.info(`Sending notification to ${patientName}...`)
      const result = await sendWhatsAppMessageAction({
        to: phone,
        body: `Hi ${patientName}, your turn is next. Please make your way to the consultation room.`
      })
      if (result.isSuccess) {
        toast.success("Notification sent successfully!")
      } else {
        toast.error(`Failed to send notification: ${result.message}`)
      }
    })
  }

  return {
    isPending,
    handleUpdateStatus,
    handleReorderItems,
    handleNotify
  }
}
