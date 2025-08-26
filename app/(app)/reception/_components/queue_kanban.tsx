/**
 * @file queue-kanban.tsx
 *
 * @description
 * This client component renders the main Kanban-style board for the reception
 * dashboard. It now includes the QueueCard definition locally to resolve
 * persistent type errors and manages all drag-and-drop interactions.
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
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase-client"
import { useQueueMutations } from "./use_queue_mutations"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload
} from "@supabase/supabase-js"
import { SelectQueueItem, queueStatusEnum } from "@/db/schema"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import {
  Bell,
  Check,
  GripVertical,
  MessageSquareText,
  User,
  X
} from "lucide-react"

// --- Merged QueueCard Component ---
// By defining QueueCard here, we ensure the props are always in sync.

interface QueueCardProps {
  item: SelectQueueItem
  onAdvance: (id: string) => void
  onCancel: (id: string) => void
  onNotify: (id: string) => void
  isOverlay?: boolean
}

function QueueCard({
  item,
  onAdvance,
  onCancel,
  onNotify,
  isOverlay
}: QueueCardProps) {
  return (
    <Card className={cn("bg-card shadow-sm", isOverlay && "shadow-lg")}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-bold">{item.patientName}</CardTitle>
        <GripVertical className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <p className="text-sm text-muted-foreground">{item.reason}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-2 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNotify(item.id)}
          disabled={!item.phone}
        >
          <Bell className="mr-2 size-4" /> Notify
        </Button>
        <Button size="sm" onClick={() => onAdvance(item.id)}>
          <Check className="mr-2 size-4" /> Advance
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={() => onCancel(item.id)}
        >
          <X className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// --- Main Kanban Component ---

export type GroupedQueueItems = {
  [key in (typeof queueStatusEnum.enumValues)[number]]?: SelectQueueItem[]
}

interface QueueKanbanProps {
  initialData: GroupedQueueItems
}

const KANBAN_COLUMNS = queueStatusEnum.enumValues

export default function QueueKanban({ initialData }: QueueKanbanProps) {
  const [items, setItems] = useState<GroupedQueueItems>(initialData)
  const [activeItem, setActiveItem] = useState<SelectQueueItem | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const { updateStatusMutation, reorderQueueMutation } = useQueueMutations()

  useEffect(() => {
    setIsMounted(true)
    // ... (rest of your useEffect logic for realtime updates)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const item = findItemById(event.active.id as string)
    setActiveItem(item)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const activeContainer = findContainerById(activeId)
    const overContainer = findContainerById(over.id as string)

    if (!activeContainer || !overContainer) return

    if (activeContainer === overContainer) {
      const currentItems = items[activeContainer]!
      const activeIndex = currentItems.findIndex(i => i.id === activeId)
      const overIndex = currentItems.findIndex(i => i.id === over.id)

      if (activeIndex !== overIndex) {
        const reordered = arrayMove(currentItems, activeIndex, overIndex)
        const itemsToUpdate = reordered.map((item, index) => ({
          id: item.id,
          position: index
        }))
        reorderQueueMutation(itemsToUpdate)
      }
    } else {
      updateStatusMutation(activeId, overContainer)
    }
  }

  const handleAdvance = (id: string) => {
    const item = findItemById(id)
    if (!item || item.status === "COMPLETE" || item.status === "CANCELLED")
      return
    const nextStatus = item.status === "WAITLIST" ? "SERVING" : "COMPLETE"
    updateStatusMutation(id, nextStatus)
  }

  const handleCancel = (id: string) => {
    updateStatusMutation(id, "CANCELLED")
  }

  const handleNotify = (id: string) => {
    const item = findItemById(id)
    toast(`Sending reminder to ${item?.patientName}...`)
  }

  const findItemById = (id: string): SelectQueueItem | null => {
    for (const status of KANBAN_COLUMNS) {
      const item = items[status]?.find(i => i.id === id)
      if (item) return item
    }
    return null
  }

  const findContainerById = (
    id: string
  ): (typeof KANBAN_COLUMNS)[number] | null => {
    if (KANBAN_COLUMNS.includes(id as any)) {
      return id as (typeof KANBAN_COLUMNS)[number]
    }
    return findItemById(id)?.status ?? null
  }

  const columns = useMemo(
    () =>
      KANBAN_COLUMNS.map(status => (
        <QueueColumn key={status} id={status} title={status}>
          {items[status]?.map(item => (
            <DraggableQueueCard
              key={item.id}
              item={item}
              onAdvance={handleAdvance}
              onCancel={handleCancel}
              onNotify={handleNotify}
            />
          ))}
        </QueueColumn>
      )),
    [items]
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid h-[calc(100vh-80px)] auto-rows-max grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        {columns}
      </div>
      {isMounted
        ? createPortal(
            <DragOverlay>
              {activeItem ? (
                <QueueCard
                  item={activeItem}
                  onAdvance={() => {}}
                  onCancel={() => {}}
                  onNotify={() => {}}
                  isOverlay
                />
              ) : null}
            </DragOverlay>,
            document.body
          )
        : null}
    </DndContext>
  )
}

function QueueColumn({
  id,
  title,
  children
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-muted/50 flex h-full flex-col gap-y-2 rounded-lg p-2 transition-colors",
        isOver && "bg-muted"
      )}
    >
      <h3 className="text-md text-foreground px-2 font-semibold capitalize tracking-tight">
        {title.toLowerCase()}
      </h3>
      <div className="grow space-y-2 overflow-y-auto p-1">{children}</div>
    </div>
  )
}

interface DraggableQueueCardProps {
  item: SelectQueueItem
  onAdvance: (id: string) => void
  onCancel: (id: string) => void
  onNotify: (id: string) => void
}

function DraggableQueueCard({
  item,
  onAdvance,
  onCancel,
  onNotify
}: DraggableQueueCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { item }
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <QueueCard
        item={item}
        onAdvance={onAdvance}
        onCancel={onCancel}
        onNotify={onNotify}
      />
    </div>
  )
}
