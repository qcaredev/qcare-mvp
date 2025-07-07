/**
 * @file queue-kanban.tsx
 *
 * @description
 * This client component renders the main Kanban-style board for the reception
 * dashboard. It receives initial queue data from the parent server component and
 * handles all drag-and-drop interactions for reordering and updating the status
 * of patients in the queue. It uses the `useQueueMutations` hook to communicate
 * changes to the server.
 *
 * @dependencies
 * - `@dnd-kit/core`: Core library for drag-and-drop functionality.
 * - `react`: For state and lifecycle management.
 * - `react-dom`: For `createPortal` used with `<DragOverlay>`.
 * - `./queue-card.tsx`: The component for rendering individual patient cards.
 * - `./use-queue-mutations.ts`: The custom hook for server-side mutations.
 */
"use client"

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
import { SelectQueueItem, queueStatusEnum } from "@/db/schema"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import QueueCard from "./queue_card"
import { useQueueMutations } from "./use_queue_mutations"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const item = findItemById(event.active.id as string)
    setActiveItem(item)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) return
    if (active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainerById(activeId)
    const overContainer = findContainerById(overId)

    if (!activeContainer || !overContainer || !activeItem) return

    if (activeContainer !== overContainer) {
      // --- Move to a different column ---
      setItems(prev => {
        const activeItems = prev[activeContainer]
          ? [...prev[activeContainer]!]
          : []
        const overItems = prev[overContainer] ? [...prev[overContainer]!] : []

        const activeIndex = activeItems.findIndex(i => i.id === activeId)
        const overIndex = overItems.findIndex(i => i.id === overId)

        const [movedItem] = activeItems.splice(activeIndex, 1)
        overItems.splice(
          overIndex >= 0 ? overIndex : overItems.length,
          0,
          movedItem
        )

        const newItems = { ...prev }
        newItems[activeContainer] = activeItems.map((item, index) => ({
          ...item,
          position: index
        }))
        newItems[overContainer] = overItems.map((item, index) => ({
          ...item,
          status: overContainer,
          position: index
        }))

        return newItems
      })

      updateStatusMutation(activeId, overContainer)
    } else {
      // --- Reorder in the same column ---
      setItems(prev => {
        const currentItems = prev[activeContainer]
          ? [...prev[activeContainer]!]
          : []
        const activeIndex = currentItems.findIndex(i => i.id === activeId)
        const overIndex = currentItems.findIndex(i => i.id === overId)

        const [movedItem] = currentItems.splice(activeIndex, 1)
        currentItems.splice(overIndex, 0, movedItem)

        const newItems = { ...prev }
        newItems[activeContainer] = currentItems.map((item, index) => ({
          ...item,
          position: index
        }))

        reorderQueueMutation(
          newItems[activeContainer]!.map(({ id, position }) => ({
            id,
            position: position!
          }))
        )

        return newItems
      })
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
    // TODO: wire up to sendWhatsAppMessageAction
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
                  isOverlay
                  onAdvance={() => {}}
                  onCancel={() => {}}
                  onNotify={() => {}}
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

// Explicitly define props for the draggable card wrapper for type safety
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
