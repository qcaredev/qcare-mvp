/**
 * @file admin-dashboard-client.tsx
 *
 * @description
 * This client component renders the main UI for the admin dashboard. It takes
 * initial analytics data as props and provides a CSV download feature by calling
 * a dedicated server action.
 */
"use client"

import { exportConsultHistoryAction } from "@/actions/db/analytics-actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Clock, Download, Hourglass, LineChart } from "lucide-react"
import { toast } from "sonner"

interface AdminDashboardClientProps {
  clinicId: string
  averageTimes: {
    avgWaitSeconds: number
    avgConsultSeconds: number
  }
}

// Helper function to format seconds into a "X min Y sec" string
const formatSeconds = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes} min ${remainingSeconds} sec`
}

export function AdminDashboardClient({
  averageTimes,
  clinicId
}: AdminDashboardClientProps) {
  const handleExport = async () => {
    toast.info("Generating CSV file...")

    const result = await exportConsultHistoryAction(clinicId)

    if (!result.isSuccess) {
      toast.error(result.message)
      return
    }

    try {
      const blob = new Blob([result.data.csv], {
        type: "text/csv;charset=utf-8;"
      })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute(
        "download",
        `qcare_consult_history_${new Date().toISOString().split("T")[0]}.csv`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("CSV download started.")
    } catch (error) {
      console.error("Failed to trigger CSV download:", error)
      toast.error("Failed to trigger CSV download.")
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 size-4" />
          Download CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Wait Time
            </CardTitle>
            <Hourglass className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSeconds(averageTimes.avgWaitSeconds)}
            </div>
            <p className="text-muted-foreground text-xs">
              Average for patients today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Consultation Time
            </CardTitle>
            <Clock className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSeconds(averageTimes.avgConsultSeconds)}
            </div>
            <p className="text-muted-foreground text-xs">
              Average for patients today
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 size-5" />
              Wait Time Trends
            </CardTitle>
            <CardDescription>
              Chart visualization of wait times over the past week (WIP).
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-muted/50 flex h-[300px] items-center justify-center rounded-b-lg">
            <p className="text-muted-foreground">
              Chart component will be rendered here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
