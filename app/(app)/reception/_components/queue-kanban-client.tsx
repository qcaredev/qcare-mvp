/**
 * @file queue-kanban-client.tsx
 * @description This client component renders the main Kanban board UI.
 * It now defines and passes down action handlers to each QueueCard.
 *
 * @dependencies
 * - All previous dependencies.
 */
"use client"

import { SelectQueueItem, queueStatusEnum } from "@/db/schema"
import { useQueueMutations } from "@/lib/hooks/use-queue-mutations"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { PatientRegistrationForm } from "./patient-registration-form"
import { QueueCard } from "./queue_card"

interface QueueKanbanClientProps {
  branchId: string
  initialQueueItems: SelectQueueItem[]
}

type GroupedQueueItems = {
  [key in (typeof queueStatusEnum.enumValues)[number]]: SelectQueueItem[]
}

export function QueueKanbanClient({
  branchId,
  initialQueueItems
}: QueueKanbanClientProps) {
  const [items, setItems] = useState(initialQueueItems)
  const [activeItem, setActiveItem] = useState<SelectQueueItem | null>(null)
  const { handleUpdateStatus, handleReorderItems, handleNotify } =
    useQueueMutations()

  useEffect(() => {
    setItems(initialQueueItems)
  }, [initialQueueItems])

  const groupedItems = useMemo<GroupedQueueItems>(() => {
    const groups: GroupedQueueItems = {
      WAITLIST: [],
      SERVING: [],
      COMPLETE: [],
      CANCELLED: []
    }
    for (const item of items) {
      if (item.status && groups[item.status]) {
        groups[item.status].push(item)
      }
    }
    groups.WAITLIST.sort((a, b) => a.position - b.position)
    return groups
  }, [items])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const item = items.find(i => i.id === active.id)
    if (item) {
      setActiveItem(item)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    if (activeId === overId) return

    const activeItem = items.find(i => i.id === activeId)
    if (!activeItem) return

    const activeContainer = activeItem.status
    const overContainer =
      items.find(i => i.id === overId)?.status ??
      (over.data.current?.status as keyof GroupedQueueItems)

    if (!activeContainer || !overContainer) return

    if (activeContainer === overContainer) {
      if (activeContainer === "WAITLIST") {
        const activeIndex = groupedItems.WAITLIST.findIndex(
          i => i.id === activeId
        )
        const overIndex = groupedItems.WAITLIST.findIndex(i => i.id === overId)

        if (activeIndex !== overIndex) {
          const newWaitlist = arrayMove(
            groupedItems.WAITLIST,
            activeIndex,
            overIndex
          )
          setItems(prev => [
            ...prev.filter(i => i.status !== "WAITLIST"),
            ...newWaitlist
          ])
          handleReorderItems(
            newWaitlist.map((item, index) => ({ id: item.id, position: index }))
          )
        }
      }
    } else {
      const newStatus = overContainer
      setItems(prev =>
        prev.map(item =>
          item.id === activeId ? { ...item, status: newStatus } : item
        )
      )
      handleUpdateStatus(activeId, newStatus)
    }
  }

  const handleAdvance = (
    id: string,
    currentStatus: SelectQueueItem["status"]
  ) => {
    let nextStatus: SelectQueueItem["status"] | undefined
    if (currentStatus === "WAITLIST") nextStatus = "SERVING"
    if (currentStatus === "SERVING") nextStatus = "COMPLETE"

    if (nextStatus) {
      handleUpdateStatus(id, nextStatus)
    }
  }

  const handleCancel = (id: string) => {
    handleUpdateStatus(id, "CANCELLED")
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-col p-4">
        <header className="mb-4 flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold">Reception Dashboard</h1>
          <PatientRegistrationForm branchId={branchId} />
        </header>

        <main className="grid flex-grow grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(groupedItems).map(([status, itemsInColumn]) => (
            <KanbanColumn
              key={status}
              status={status as keyof GroupedQueueItems}
              items={itemsInColumn}
              onAdvance={handleAdvance}
              onCancel={handleCancel}
              onNotify={handleNotify}
            />
          ))}
        </main>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
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
        )}
    </DndContext>
  )
}

function KanbanColumn({
  status,
  items,
  onAdvance,
  onCancel,
  onNotify
}: {
  status: keyof GroupedQueueItems
  items: SelectQueueItem[]
  onAdvance: (id: string, currentStatus: SelectQueueItem["status"]) => void
  onCancel: (id: string) => void
  onNotify: (phone: string, name: string) => void
}) {
  const itemIds = useMemo(() => items.map(i => i.id), [items])

  return (
    <div className="flex flex-col rounded-lg bg-muted/50 p-2">
      <h2 className="mb-2 p-2 text-lg font-semibold text-foreground">
        {status} ({items.length})
      </h2>
      <SortableContext items={itemIds}>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {items.length > 0 ? (
            items.map(item => (
              <QueueCard
                key={item.id}
                item={item}
                onAdvance={onAdvance}
                onCancel={onCancel}
                onNotify={onNotify}
              />
            ))
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="p-4 text-center text-sm text-muted-foreground">
                Drop here
              </p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
