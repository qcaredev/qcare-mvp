/**
 * @file app/admin/page.tsx
 *
 * @description
 * This file defines the server page for the Admin Dashboard. It fetches all
 * necessary analytics and settings data and passes it to a client component for display.
 */
"use server"

import { getDailyAverageWaitTimesAction } from "@/actions/db/analytics-actions"
import { getClinicSettingsAction } from "@/actions/db/branch-settings-actions"
import { Suspense } from "react"
import { AdminDashboardClient } from "./_components/admin-dashboard-client"

function AdminPageSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-80 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  )
}

/**
 * The primary server component for the `/admin` route.
 */
export default async function AdminPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminDataFetcher />
    </Suspense>
  )
}

/**
 * An async server component that fetches all data required for the admin
 * dashboard and passes it to the client component.
 */
async function AdminDataFetcher() {
  // NOTE: This is a placeholder. In a real application, this ID would
  // be dynamically retrieved from the authenticated user's session or profile.
  const MOCK_CLINIC_ID = "c7e2b8a0-3b7a-4b1e-8e0a-9e0e3e7f1b2a"

  // Fetch analytics and settings data in parallel for efficiency
  const [avgTimesResult, settingsResult] = await Promise.all([
    getDailyAverageWaitTimesAction(MOCK_CLINIC_ID),
    getClinicSettingsAction(MOCK_CLINIC_ID)
  ])

  if (!avgTimesResult.isSuccess || !settingsResult.isSuccess) {
    const errorMessage =
      avgTimesResult.message || settingsResult.message || "Failed to load data."
    return <div className="p-4 text-red-500">Error: {errorMessage}</div>
  }

  return (
    <AdminDashboardClient
      clinicId={MOCK_CLINIC_ID}
      averageTimes={avgTimesResult.data}
      clinicSettings={settingsResult.data}
    />
  )
}
