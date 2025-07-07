/**
 * @file app/admin/page.tsx
 *
 * @description
 * This file defines the server page for the Admin Dashboard. It fetches all
 * necessary analytics and passes it to a client component for display.
 */
"use server"

import { getDailyAverageWaitTimesAction } from "@/actions/db/analytics-actions"
import { Suspense } from "react"
import { AdminDashboardClient } from "./_components/admin-dashboard-client"

/**
 * A basic skeleton component for the admin page loading state.
 */
function AdminPageSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="bg-muted h-8 w-1/4 animate-pulse rounded-md" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted h-24 w-full animate-pulse rounded-lg" />
        <div className="bg-muted h-24 w-full animate-pulse rounded-lg" />
      </div>
      <div className="bg-muted h-80 w-full animate-pulse rounded-lg" />
    </div>
  )
}

/**
 * The primary server component for the `/admin` route.
 */
export default async function AdminPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AnalyticsDataFetcher />
    </Suspense>
  )
}

/**
 * An async server component that fetches all data required for the admin
 * dashboard and passes it to the client component.
 */
async function AnalyticsDataFetcher() {
  // NOTE: This is a placeholder. In a real application, this ID would
  // be dynamically retrieved from the authenticated user's session or profile.
  const MOCK_CLINIC_ID = "c7e2b8a0-3b7a-4b1e-8e0a-9e0e3e7f1b2a"

  const avgTimesResult = await getDailyAverageWaitTimesAction(MOCK_CLINIC_ID)

  if (!avgTimesResult.isSuccess) {
    return (
      <div className="p-4 text-red-500">Error: {avgTimesResult.message}</div>
    )
  }

  return (
    <AdminDashboardClient
      clinicId={MOCK_CLINIC_ID}
      averageTimes={avgTimesResult.data}
    />
  )
}
