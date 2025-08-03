/**
 * @file admin-dashboard-client.tsx
 *
 * @description
 * This client component renders the main UI for the admin dashboard. It takes
 * the fetched analytics and settings data as props and displays it.
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
import { SelectClinicSettings } from "@/db/schema"
import { Clock, Download, Hourglass, LineChart } from "lucide-react"
import { toast } from "sonner"
import { SettingsForm } from "./settings-form"

interface AdminDashboardClientProps {
  clinicId: string
  averageTimes: {
    avgWaitSeconds: number
    avgConsultSeconds: number
  }
  clinicSettings: SelectClinicSettings | null
}

const formatSeconds = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes} min ${remainingSeconds} sec`
}

export function AdminDashboardClient({
  averageTimes,
  clinicSettings,
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
      const blob = new Blob([result.data.csv], { type: "text/csv;charset=utf-8;" })
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
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSeconds(averageTimes.avgWaitSeconds)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average for patients today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Consultation Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSeconds(averageTimes.avgConsultSeconds)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average for patients today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clinic Settings</CardTitle>
            <CardDescription>
              Manage clinic-wide notification and language settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm clinicId={clinicId} initialData={clinicSettings} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Wait Time Trends
            </CardTitle>
            <CardDescription>
              Chart visualization of wait times over the past week (WIP).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full flex items-center justify-center bg-muted/50 rounded-b-lg">
            <p className="text-muted-foreground">
              Chart component will be rendered here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
