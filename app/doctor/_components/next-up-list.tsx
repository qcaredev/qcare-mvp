/**
 * @file next-up-list.tsx
 *
 * @description
 * This client component displays the list of patients in the 'WAITLIST' for
 * a specific doctor and now includes real-time updates from Supabase.
 *
 * @props
 * - `items`: The initial array of `SelectQueueItem` objects.
 * - `doctorId`: The ID of the doctor to filter the queue for.
 */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectQueueItem } from "@/db/schema"
import { supabase } from "@/lib/supabase-client"
import { RealtimeChannel } from "@supabase/supabase-js"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import MiniProfileDialog from "./mini_profile_dialog"

// This component safely renders a relative time string on the client
// to prevent hydration mismatch errors.
function RelativeTime({ date }: { date: Date | string | null | undefined }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !date) {
    return null // Don't render on the server or if date is null
  }

  // This will only run on the client
  return <>{formatDistanceToNow(new Date(date), { addSuffix: true })}</>
}

interface NextUpListProps {
  items: SelectQueueItem[]
  doctorId: string
}

export default function NextUpList({ items, doctorId }: NextUpListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectQueueItem | null>(null)
  const [patientList, setPatientList] = useState(items)
  const router = useRouter()

  useEffect(() => {
    setPatientList(items)
  }, [items])

  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel(`doctor-queue-${doctorId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "queue_items",
          filter: `doctor_id=eq.${doctorId}`
        },
        payload => {
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [doctorId, router])

  const handleViewProfileClick = (item: SelectQueueItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl p-4">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">
          Your Upcoming Patients
        </h1>

        {patientList.length === 0 ? (
          <p className="text-muted-foreground mt-8 text-center">
            You have no patients in the waitlist.
          </p>
        ) : (
          <div className="space-y-4">
            {patientList.map(item => (
              <Card key={item.id} className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.patientName}</span>
                    <span className="text-muted-foreground text-sm font-medium">
                      Waiting for <RelativeTime date={item.createdAt} />
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {item.reason || "No reason provided."}
                  </p>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleViewProfileClick(item)}
                    >
                      View Profile
                    </Button>
                    <Button>Start Consult</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MiniProfileDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
      />
    </>
  )
}
