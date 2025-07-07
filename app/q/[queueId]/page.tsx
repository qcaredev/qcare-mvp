/**
 * @file app/q/[queueId]/page.tsx
 *
 * @description
 * This file defines the dynamic server page for viewing a single patient's
 * queue status. It fetches data based on the `queueId` provided in the URL.
 */
"use server"

import { Suspense } from "react"
import PatientQueueView from "./_components/patient-queue-view"
import { getPublicQueueItemDetailsAction } from "@/actions/db/queue_items_actions"

interface PatientQueuePageProps {
  params: {
    queueId: string
  }
}

/**
 * The primary server component for the dynamic `/q/[queueId]` route.
 */
export default async function PatientQueuePage({
  params
}: PatientQueuePageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading your queue status...
        </div>
      }
    >
      <PatientQueueFetcher queueId={params.queueId} />
    </Suspense>
  )
}

/**
 * An async server component responsible for fetching the specific patient's
 * queue data and passing it to the display component.
 */
async function PatientQueueFetcher({ queueId }: { queueId: string }) {
  const result = await getPublicQueueItemDetailsAction(queueId)

  if (!result.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center font-semibold text-red-500">
        Error: {result.message}
      </div>
    )
  }

  return <PatientQueueView initialData={result.data} />
}
