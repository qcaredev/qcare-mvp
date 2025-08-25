/**
 * @file admin-dashboard-client.tsx
 * @description The client-side component for the admin dashboard, displaying
 * analytics cards and the settings management form.
 *
 * @dependencies
 * - `react`: For component logic.
 * - `@/components/ui/*`: For UI components.
 * - `@/db/schema`: For the `SelectBranchSettings` type.
 * - `lucide-react`: For icons.
 * - `./settings-form`: The form for updating clinic/branch settings.
 */
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { SelectBranchSettings } from "@/db/schema"
import { Clock, Download, Hourglass, LineChart } from "lucide-react"
import { toast } from "sonner"
import { SettingsForm } from "./settings-form"
import { exportConsultHistoryAction } from "@/actions/db/analytics-actions"
import { Button } from "@/components/ui/button"

// Define the shape of the props this component expects
interface AdminDashboardClientProps {
  branchId: string
  settingsData: {
    initialData: SelectBranchSettings | null // Data can be null if not found
  }
  analyticsData: {
    avgWaitSeconds: number
    avgConsultSeconds: number
  }
}

export function AdminDashboardClient({
  branchId,
  settingsData,
  analyticsData
}: AdminDashboardClientProps) {
  const handleExport = async () => {
    toast.info("Generating CSV export...")
    const result = await exportConsultHistoryAction(branchId)

    if (result.isSuccess) {
      toast.success("CSV generated!")
      // Create a blob from the CSV string and trigger a download
      const blob = new Blob([result.data.csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `consult-history-${branchId}-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analyticsData.avgWaitSeconds / 60)} min
            </div>
            <p className="text-xs text-muted-foreground">
              Average patient wait time today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Consult Time
            </CardTitle>
            <Hourglass className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analyticsData.avgConsultSeconds / 60)} min
            </div>
            <p className="text-xs text-muted-foreground">
              Average consultation duration today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branch Settings</CardTitle>
            <CardDescription>
              Manage clinic-wide notification and language settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* FIX: Check if initialData exists before rendering the form */}
            {settingsData.initialData ? (
              <SettingsForm initialData={settingsData.initialData} />
            ) : (
              <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  No settings found for this branch.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Wait Time Trends
                </CardTitle>
                <CardDescription>
                  Visualization of wait times over the past week (WIP).
                </CardDescription>
              </div>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="mr-2 size-4" />
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex h-full items-center justify-center rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Chart component will be rendered here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
