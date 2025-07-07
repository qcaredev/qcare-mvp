/**
 * @file queue-card.tsx
 *
 * @description
 * This client component renders a single patient card for the Kanban board.
 * It displays essential patient information and provides action buttons for
 * staff to manage the queue item.
 *
 * @props
 * - `item`: A `SelectQueueItem` object containing the patient's data.
 * - `isOverlay`: (Optional) A boolean to indicate if the card is being
 * rendered in a drag overlay. If true, it applies a rotation style.
 *
 * @dependencies
 * - `shadcn/ui`: For Card and Button components.
 * - `lucide-react`: For icons.
 * - `date-fns`: For formatting the waiting time.
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
import { Bell, Check, Phone, User, X } from "lucide-react"

interface QueueCardProps {
  item: SelectQueueItem
  isOverlay?: boolean
}

export default function QueueCard({ item, isOverlay }: QueueCardProps) {
  return (
    <Card
      className={cn(
        "mb-4 bg-white shadow-sm",
        isOverlay && "ring-primary ring-2"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center justify-between text-base font-bold">
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
          Waiting:{" "}
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between p-2 pt-0">
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Notify:", item.id)}
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
            onClick={() => console.log("Cancel:", item.id)}
            title="Cancel Appointment"
          >
            <X className="text-destructive size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Advance:", item.id)}
            title="Advance to Next Stage"
          >
            <Check className="size-5 text-green-600" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
