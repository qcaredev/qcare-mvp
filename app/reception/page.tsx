/**
 * @file app/reception/page.tsx
 *
 * @description
 * This file defines the server page for the main reception dashboard. It follows
 * the recommended Next.js pattern of using a Server Component to fetch data and
 * then passing that data to a Client Component for rendering and interactivity.
 *
 * @features
 * - **Server-Side Data Fetching**: Retrieves queue data on the server.
 * - **Suspense for Loading States**: Uses React's `<Suspense>` to show a
 * skeleton UI while data is being fetched, improving the user experience.
 * - **Data Grouping**: Processes the flat list of queue items from the database
 * into a structure grouped by status, ready for the Kanban board component.
 *
 * @notes
 * - A mock `clinicId` is used for now. This will be replaced with dynamic data
 * from the user's session once authentication and multi-tenancy are fully
 * integrated.
 */
"use server"

import { getQueueItemsByClinicAction } from "@/actions/db/queue_items_actions"
import { SelectQueueItem } from "@/db/schema"
import { Suspense } from "react"
import QueueKanban, { GroupedQueueItems } from "./_components/queue_kanban"
import { ReceptionPageSkeleton } from "./_components/reception-page-skeleton"

/**
 * The primary server component for the `/reception` route. It wraps the
 * data-fetching component in a Suspense boundary to handle loading states.
 */
export default async function ReceptionPage() {
  return (
    <Suspense fallback={<ReceptionPageSkeleton />}>
      <QueueDataFetcher />
    </Suspense>
  )
}

/**
 * An asynchronous server component responsible for fetching and processing
 * the queue data before passing it to the client-side Kanban board.
 */
async function QueueDataFetcher() {
  // NOTE: This is a placeholder. In a multi-tenant application, this ID would
  // be dynamically retrieved from the authenticated user's session or profile.
  const MOCK_CLINIC_ID = "c7e2b8a0-3b7a-4b1e-8e0a-9e0e3e7f1b2a"

  const result = await getQueueItemsByClinicAction(MOCK_CLINIC_ID)

  // Handle cases where the data fetching action fails.
  if (!result.isSuccess) {
    // In a real application, you might render a more sophisticated error component.
    return <div className="p-4 text-red-500">Error: {result.message}</div>
  }

  // Group the flat array of queue items into an object keyed by status.
  const groupedData = (result.data || []).reduce<GroupedQueueItems>(
    (acc, item) => {
      // The status from the DB should always be valid, but we provide a
      // fallback to prevent runtime errors.
      const status = item.status!
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status]!.push(item)
      return acc
    },
    {}
  )

  // Render the client component with the prepared initial data.
  return <QueueKanban initialData={groupedData} />
}
