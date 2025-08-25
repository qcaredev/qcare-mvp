/**
 * @file app/reception/page.tsx
 * @description This file defines the server page for the reception dashboard.
 * It is responsible for fetching all necessary data for the Kanban view,
 * including the user's branch and the current list of patients in the queue.
 *
 * @dependencies
 * - `@clerk/nextjs/server`: For authenticating the user on the server.
 * - `actions/db/*`: To fetch profile and queue data.
 * - `_components/*`: The client components for rendering the dashboard.
 */
"use server"

import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { getQueueItemsByBranchAction } from "@/actions/db/queue_items_actions"
import { QueueKanbanClient } from "./_components/queue-kanban-client"
import { QueueKanbanSkeleton } from "./_components/queue-kanban-skeleton"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"

/**
 * @function ReceptionPage
 * @description The main server component for the `/reception` route. It handles
 * data fetching for the entire dashboard.
 */
export default async function ReceptionPage() {
  return (
    <div className="h-full w-full">
      <Suspense fallback={<QueueKanbanSkeleton />}>
        <ReceptionDashboardFetcher />
      </Suspense>
    </div>
  )
}

/**
 * @function ReceptionDashboardFetcher
 * @description An async server component that fetches all required data and
 * passes it down to the client component responsible for rendering and interactivity.
 */
async function ReceptionDashboardFetcher() {
  const { userId } = auth()
  if (!userId) {
    redirect("/login")
  }

  const profileResult = await getProfileByUserIdAction(userId)
  if (!profileResult.isSuccess || !profileResult.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">
          Could not load user profile. Please contact support.
        </p>
      </div>
    )
  }

  const { branchId } = profileResult.data
  const queueItemsResult = await getQueueItemsByBranchAction(branchId)

  if (!queueItemsResult.isSuccess) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{queueItemsResult.message}</p>
      </div>
    )
  }

  return (
    <QueueKanbanClient
      branchId={branchId}
      initialQueueItems={queueItemsResult.data}
    />
  )
}
