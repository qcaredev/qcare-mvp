/**
 * @file queue-card.tsx
 *
 * @description
 * This client component renders a single patient card for the Kanban board.
 * It displays essential patient information and provides action buttons that
 * trigger callback functions passed down as props.
 */
"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { SelectQueueItem } from "@/db/schema"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check, User, X } from "lucide-react"
import { useEffect, useState } from "react"

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

interface QueueCardProps {
  item: SelectQueueItem
  onAdvance: (id: string) => void
  onCancel: (id: string) => void
  onNotify: (id: string) => void
  isOverlay?: boolean
}

export default function QueueCard({
  item,
  onAdvance,
  onCancel,
  onNotify,
  isOverlay
}: QueueCardProps) {
  const handleAdvanceClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent dnd-kit from capturing the click
    onAdvance(item.id)
  }

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCancel(item.id)
  }

  const handleNotifyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onNotify(item.id)
  }

  return (
    <Card
      className={cn(
        "mb-4 touch-none shadow-sm transition-shadow hover:shadow-md",
        isOverlay && "ring-primary ring-2"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex cursor-grab items-center justify-between text-base font-bold">
          <span>{item.patientName}</span>
          {item.position !== null && item.position >= 0 && (
            <span className="text-muted-foreground text-sm font-normal">
              #{item.position + 1}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 px-4 pb-2">
        {item.reason && (
          <p className="text-muted-foreground text-sm">{item.reason}</p>
        )}

        {item.doctorId && (
          <div className="text-muted-foreground flex items-center text-xs">
            <User className="mr-1.5 size-3" />
            <span>Dr. {item.doctorId}</span>
          </div>
        )}

        <p className="text-muted-foreground pt-1 text-xs">
          Waiting: <RelativeTime date={item.createdAt} />
        </p>
      </CardContent>

      <CardFooter className="flex justify-between p-2 pt-0">
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotifyClick}
            disabled={!item.phone}
            title={item.phone ? "Send Reminder" : "No phone number available"}
          >
            <Bell className="size-4" />
          </Button>
        </div>

        <div className="space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancelClick}
            title="Cancel Appointment"
          >
            <X className="text-destructive size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAdvanceClick}
            title="Advance to Next Stage"
          >
            <Check className="size-5 text-green-600" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
