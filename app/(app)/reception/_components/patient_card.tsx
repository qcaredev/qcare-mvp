/**
 * @file app/(app)/reception/_components/patient-card.tsx
 *
 * @description
 * This component renders a single, draggable patient card for the Kanban board.
 * It displays key patient information and is powered by `@dnd-kit/sortable`.
 *
 * @dependencies
 * - `@dnd-kit/sortable`: For the `useSortable` hook to enable drag-and-drop.
 * - `lucide-react`: For icons.
 * - `@/components/ui/card`: The base card component from Shadcn.
 * - `@/db/schema`: For the `SelectQueueItem` type.
 * - `date-fns`: For formatting timestamps.
 */
"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { SelectQueueItem } from "@/db/schema"
import { formatDistanceToNow } from "date-fns"

interface PatientCardProps {
  item: SelectQueueItem
}

export function PatientCard({ item }: PatientCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: item.id,
    data: {
      type: "QueueItem",
      item
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  // When dragging, apply an opacity effect to the original card.
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[150px] rounded-lg border-2 border-primary bg-card opacity-50"
      />
    )
  }

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{item.patientName}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 text-sm">
        <p className="text-muted-foreground">
          {item.reason || "No reason provided."}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </div>
        <div className="text-xs font-semibold">{item.doctorId}</div>
      </CardFooter>
    </Card>
  )
}
