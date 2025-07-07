/**
 * @file app/doctor/page.tsx
 *
 * @description
 * This file defines the server page for the Doctor's Dashboard. It's responsible
 * for fetching the list of patients assigned to a specific doctor and are
 * currently in the waitlist.
 *
 * @features
 * - **Role-Specific Data**: Fetches data relevant only to the logged-in doctor.
 * - **Suspense for Loading States**: Shows a skeleton loader while fetching data.
 * - **Server/Client Component Pattern**: Uses a server component for data fetching
 * and passes the result to a client component for display.
 *
 * @notes
 * - Mock IDs for `clinicId` and `doctorId` are used for now. These will be
 * replaced with dynamic data from the authenticated user's session.
 */
"use server"

import { Suspense } from "react"
import { DoctorPageSkeleton } from "./_components/doctor-page-skeleton"
import NextUpList from "./_components/next-up-list"
import { getQueueItemsByDoctorIdAction } from "@/actions/db/queue_items_actions"

/**
 * The main server component for the `/doctor` route, wrapping the data
 * fetcher in a Suspense boundary.
 */
export default async function DoctorPage() {
  return (
    <Suspense fallback={<DoctorPageSkeleton />}>
      <DoctorViewDataFetcher />
    </Suspense>
  )
}

/**
 * Async server component to fetch and pass data to the doctor's patient list.
 */
async function DoctorViewDataFetcher() {
  // NOTE: These are placeholders. In a real application, they would be
  // dynamically retrieved from the authenticated user's session/profile.
  const MOCK_CLINIC_ID = "c7e2b8a0-3b7a-4b1e-8e0a-9e0e3e7f1b2a"
  const MOCK_DOCTOR_ID = "Singh"

  const result = await getQueueItemsByDoctorIdAction(
    MOCK_CLINIC_ID,
    MOCK_DOCTOR_ID
  )

  if (!result.isSuccess) {
    return <div className="p-4 text-red-500">Error: {result.message}</div>
  }

  return <NextUpList items={result.data} />
}
