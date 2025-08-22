/**
 * @file app/(app)/reception/page.tsx
 *
 * @description
 * This file defines the server page for the Reception Dashboard. It is responsible
 * for fetching the queue data specific to the logged-in receptionist's branch
 * and rendering the main Kanban-style queue management interface.
 *
 * @dependencies
 * - `next/cache`: For revalidating data paths.
 * - `react`: For component rendering and Suspense.
 * - `@clerk/nextjs/server`: For authenticating the user on the server.
 * - `@/actions/db/profiles-actions`: To fetch the user's profile and branch ID.
 * - `@/actions/db/queue_items_actions`: To fetch the patient queue.
 * - `./_components/reception-kanban-client`: The client component that renders the interactive Kanban board.
 */
"use server"

import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { getQueueItemsByBranchAction } from "@/actions/db/queue_items_actions"
import ReceptionKanbanClient from "./_components/reception_kanban_client"

/**
 * The primary server component for the `/reception` route.
 * It uses a Suspense boundary to show a loading state while fetching essential data.
 */
export default async function ReceptionPage() {
  return (
    <div className="flex h-full flex-col p-4">
      <h1 className="mb-4 text-2xl font-bold">Reception Dashboard</h1>
      <Suspense fallback={<p>Loading queue...</p>}>
        <QueueDataFetcher />
      </Suspense>
    </div>
  )
}

/**
 * An asynchronous server component responsible for the complete data fetching
 * logic for the reception dashboard. It authenticates the user, finds their
 * branch, and fetches the corresponding patient queue.
 *
 * @notes
 * - This pattern keeps data fetching logic cleanly separated on the server.
 * - It provides robust error handling for common failure scenarios.
 */
async function QueueDataFetcher() {
  // 1. Authenticate the user and get their ID.
  const { userId } = auth()
  if (!userId) {
    return <p className="text-red-500">Error: Not authenticated.</p>
  }

  // 2. Fetch the user's profile to determine their assigned branch.
  const profileResult = await getProfileByUserIdAction(userId)
  if (!profileResult.isSuccess || !profileResult.data) {
    return (
      <p className="text-red-500">
        Error: Could not find a user profile. Please contact an administrator.
      </p>
    )
  }
  const { branchId } = profileResult.data

  // 3. Fetch the queue items specifically for that branch.
  const queueResult = await getQueueItemsByBranchAction(branchId)
  if (!queueResult.isSuccess) {
    return <p className="text-red-500">Error: {queueResult.message}</p>
  }

  // 4. Pass the fetched data to the client component for rendering.
  return <ReceptionKanbanClient initialQueueItems={queueResult.data} />
}
