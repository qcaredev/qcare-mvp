/**
 * @file queue-card.tsx
 * @description A client component that renders a card for a single patient in the queue.
 * It is a draggable component and now includes action buttons to modify patient status.
 *
 * @dependencies
 * - All previous dependencies plus `lucide-react` for new icons.
 */
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SelectQueueItem } from "@/db/schema"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Bell,
  Check,
  GripVertical,
  MessageSquareText,
  User,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QueueCardProps {
  item: SelectQueueItem
  isOverlay?: boolean
  onAdvance: (
    id: string,
    currentStatus: SelectQueueItem["status"]
  ) => void
  onCancel: (id: string) => void
  onNotify: (phone: string, name: string) => void
}

export function QueueCard({
  item,
  isOverlay,
  onAdvance,
  onCancel,
  onNotify
}: QueueCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, data: { item } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card shadow-sm",
        isOverlay && "shadow-lg shadow-primary/50"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div>
          <CardTitle className="text-base font-bold">{item.patientName}</CardTitle>
          {item.status === "WAITLIST" && (
            <CardDescription>Position: #{item.position + 1}</CardDescription>
          )}
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-1"
          aria-label="Drag handle"
        >
          <GripVertical className="text-muted-foreground" size={20} />
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-4 pt-0">
        {item.reason && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MessageSquareText size={16} className="mt-0.5 shrink-0" />
            <span>{item.reason}</span>
          </div>
        )}
        {item.doctorId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={16} className="shrink-0" />
            <span>Dr. {item.doctorId}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between p-2 pt-0">
        {item.status === "WAITLIST" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNotify(item.phone!, item.patientName)}
              disabled={!item.phone}
            >
              <Bell className="mr-2 size-4" />
              Notify
            </Button>
            <Button size="sm" onClick={() => onAdvance(item.id, item.status)}>
              <Check className="mr-2 size-4" />
              Advance
            </Button>
          </>
        )}
        {item.status === "SERVING" && (
          <Button
            size="sm"
            className="w-full"
            onClick={() => onAdvance(item.id, item.status)}
          >
            <Check className="mr-2 size-4" />
            Mark Complete
          </Button>
        )}
        {(item.status === "WAITLIST" || item.status === "SERVING") && (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onCancel(item.id)}
          >
            <X className="size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
