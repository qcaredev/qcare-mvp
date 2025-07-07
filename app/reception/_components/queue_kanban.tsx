/**
 * @file queue-kanban.tsx
 *
 * @description
 * This client component renders the main Kanban-style board for the reception
 * dashboard. It receives initial queue data from the parent server component and
 * handles all drag-and-drop interactions for reordering and updating the status
 * of patients in the queue.
 *
 * @dependencies
 * - `@dnd-kit/core`: Core library for drag-and-drop functionality.
 * - `react`: For state and lifecycle management.
 * - `react-dom`: For `createPortal` used with `<DragOverlay>`.
 * - `./queue-card.tsx`: The component for rendering individual patient cards.
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
import { useMemo, useState } from "react"
import { createPortal } from "react-dom"
import QueueCard from "./queue_card"

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3 // Require mouse to move 3px before drag starts
      }
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const item = findItemById(active.id as string)
    setActiveItem(item)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveItem(null)
      return
    }

    // If the item is dropped over itself, do nothing.
    if (active.id === over.id) {
      setActiveItem(null)
      return
    }

    const originalContainerId = findContainerById(active.id as string)
    // over.id could be a container (column) or another card.
    const overContainerId = findContainerById(over.id as string)

    if (!originalContainerId || !overContainerId || !activeItem) {
      setActiveItem(null)
      return
    }

    setItems(prev => {
      const newItems = { ...prev }
      const activeItems = newItems[originalContainerId]!
      const overItems = newItems[overContainerId]!

      const activeIndex = activeItems.findIndex(i => i.id === active.id)
      const overIndex =
        over.id in newItems
          ? overItems.length
          : overItems.findIndex(i => i.id === over.id)

      if (originalContainerId === overContainerId) {
        // Reordering within the same column
        const [removed] = activeItems.splice(activeIndex, 1)
        activeItems.splice(overIndex, 0, removed)
        newItems[originalContainerId] = activeItems.map((item, index) => ({
          ...item,
          position: index
        }))
      } else {
        // Moving to a different column (status change)
        const [removed] = activeItems.splice(activeIndex, 1)
        removed.status = overContainerId
        overItems.splice(overIndex, 0, removed)

        // Re-index both original and new columns
        newItems[originalContainerId] = activeItems.map((item, index) => ({
          ...item,
          position: index
        }))
        newItems[overContainerId] = overItems.map((item, index) => ({
          ...item,
          position: index
        }))
      }

      // TODO: Call server actions here in a future step.
      console.log(`Moved ${activeItem.patientName} to ${overContainerId}`)
      return newItems
    })

    setActiveItem(null)
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
    if (items[id as keyof GroupedQueueItems]) {
      return id as (typeof KANBAN_COLUMNS)[number]
    }
    for (const status of KANBAN_COLUMNS) {
      if (items[status]?.some(i => i.id === id)) {
        return status
      }
    }
    return null
  }

  const columns = useMemo(
    () =>
      KANBAN_COLUMNS.map(status => (
        <QueueColumn key={status} id={status} title={status}>
          {items[status]?.map(item => (
            <DraggableQueueCard key={item.id} item={item} />
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
      <div className="grid h-full grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        {columns}
      </div>

      {createPortal(
        <DragOverlay>
          {activeItem ? <QueueCard item={activeItem} isOverlay /> : null}
        </DragOverlay>,
        document.body
      )}
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
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className="bg-muted/50 flex h-full flex-col gap-y-4 rounded-lg p-4"
    >
      <h3 className="text-md text-foreground font-bold capitalize">
        {title.toLowerCase()}
      </h3>
      <div className="grow">{children}</div>
    </div>
  )
}

function DraggableQueueCard({ item }: { item: SelectQueueItem }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.id,
    data: { item }
  })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <QueueCard item={item} />
    </div>
  )
}
