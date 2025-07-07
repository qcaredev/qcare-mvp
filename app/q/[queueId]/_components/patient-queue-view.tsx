/**
 * @file patient-queue-view.tsx
 * @description This client component displays the patient's current position in the
 * queue and the estimated wait time. It now uses Supabase Realtime to listen
 * for changes and automatically refresh its data.
 *
 * @props
 * - `initialData`: The initial queue details, including the queue item ID.
 */
"use client"

import { PublicQueueDetails } from "@/actions/db/queue_items_actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import { RealtimeChannel } from "@supabase/supabase-js"
import { Clock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface PatientQueueViewProps {
  initialData: PublicQueueDetails
}

export default function PatientQueueView({
  initialData
}: PatientQueueViewProps) {
  const { position, estimatedWaitTimeMinutes } = initialData
  const queueId = initialData.queueItem.id
  const router = useRouter()

  useEffect(() => {
    // This channel listens for ANY change on the `queue_items` table.
    // When a change occurs, we refresh data to get the latest position and wait time.
    const channel: RealtimeChannel = supabase
      .channel(`patient-view-${queueId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue_items" },
        payload => {
          console.log("Change received!", payload)
          // A simple and robust way to get the latest calculated data
          // is to have the server re-render and re-fetch.
          router.refresh()
        }
      )
      .subscribe()

    // Unsubscribe when the component is unmounted
    return () => {
      supabase.removeChannel(channel)
    }
  }, [queueId, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Welcome, {initialData.queueItem.patientName}!
          </CardTitle>
          <CardDescription>
            Here is your current status in the queue. This page will update
            automatically.
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
