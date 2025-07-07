/**
 * @file patient-queue-view.tsx
 * @description This client component displays the patient's current position in the
 * queue and the estimated wait time. It's the primary UI for the public-facing
 * patient tracking page.
 *
 * @current_state For Step 6.1, this component only displays the initial data
 * fetched by the server. Real-time updates will be added in a later step.
 *
 * @props
 * - `initialData`: The initial queue details, including position and wait time.
 */
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Clock, User } from "lucide-react"
import { PublicQueueDetails } from "@/actions/db/queue_items_actions"

interface PatientQueueViewProps {
  initialData: PublicQueueDetails
}

export default function PatientQueueView({
  initialData
}: PatientQueueViewProps) {
  const { position, estimatedWaitTimeMinutes } = initialData

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Welcome, {initialData.queueItem.patientName}!
          </CardTitle>
          <CardDescription>
            Here is your current status in the queue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6 p-6 text-center">
          <div className="flex flex-col items-center rounded-lg bg-blue-50 p-4">
            <User className="mb-2 size-8 text-blue-500" />
            <p className="text-muted-foreground text-sm">You are number</p>
            <p className="text-4xl font-bold text-blue-600">{position}</p>
            <p className="text-muted-foreground text-sm">in line</p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-green-50 p-4">
            <Clock className="mb-2 size-8 text-green-500" />
            <p className="text-muted-foreground text-sm">Estimated wait is</p>
            <p className="text-4xl font-bold text-green-600">
              {estimatedWaitTimeMinutes}
            </p>
            <p className="text-muted-foreground text-sm">minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
