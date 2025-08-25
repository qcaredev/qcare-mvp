/**
 * @file queue-kanban.tsx
 *
 * @description
 * This client component renders the main Kanban-style board for the reception
 * dashboard. It receives initial queue data and then subscribes to real-time
 * updates from Supabase to keep the board synchronized across all clients.
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
import { arrayMove } from "@dnd-kit/sortable"
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload
} from "@supabase/supabase-js"
import { SelectQueueItem, queueStatusEnum } from "@/db/schema"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useQueueMutations } from "./use_queue_mutations"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase-client"
import { QueueCard } from "./queue_card"

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

    const handleRealtimeUpdate = (
      payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
    ) => {
      setItems(currentItems => {
        const newItems = JSON.parse(JSON.stringify(currentItems))
        const { eventType, new: newItem, old } = payload

        if (eventType === "INSERT") {
          const inserted = newItem as SelectQueueItem
          if (!newItems[inserted.status!]) newItems[inserted.status!] = []
          newItems[inserted.status!]!.push(inserted)
          newItems[inserted.status!]!.sort(
            (a: SelectQueueItem, b: SelectQueueItem) =>
              a.position! - b.position!
          )
          return newItems
        }

        if (eventType === "UPDATE") {
          const updated = newItem as Partial<SelectQueueItem>
          let existingItem: SelectQueueItem | null = null

          for (const status of KANBAN_COLUMNS) {
            const items = newItems[status]
            if (items) {
              const itemIndex = items.findIndex(
                (i: SelectQueueItem) => i.id === old.id
              )
              if (itemIndex !== -1) {
                ;[existingItem] = items.splice(itemIndex, 1)
                break
              }
            }
          }

          if (existingItem) {
            const mergedItem = {
              ...existingItem,
              ...updated
            } as SelectQueueItem
            const targetStatus = mergedItem.status!

            if (!newItems[targetStatus]) newItems[targetStatus] = []
            newItems[targetStatus].push(mergedItem)
            newItems[targetStatus].sort(
              (a: SelectQueueItem, b: SelectQueueItem) =>
                a.position! - b.position!
            )
          }
          return newItems
        }

        if (eventType === "DELETE") {
          for (const status of KANBAN_COLUMNS) {
            if (newItems[status]) {
              newItems[status] = newItems[status]!.filter(
                (i: SelectQueueItem) => i.id !== old.id
              )
            }
          }
          return newItems
        }

        return currentItems
      })
    }

    const channel: RealtimeChannel = supabase
      .channel("queue-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue_items" },
        handleRealtimeUpdate
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
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

    if (!over || active.id === over.id) return

    const activeId = active.id as string

    const activeContainer = findContainerById(activeId)
    const overContainer = findContainerById(over.id as string)

    if (!activeContainer || !overContainer) return

    if (activeContainer === overContainer) {
      const currentItems = items[activeContainer]!
      const activeIndex = currentItems.findIndex(
        (i: SelectQueueItem) => i.id === activeId
      )
      const overIndex = currentItems.findIndex(
        (i: SelectQueueItem) => i.id === over.id
      )

      if (activeIndex !== overIndex) {
        const reordered = arrayMove(currentItems, activeIndex, overIndex)
        const itemsToUpdate = reordered.map(
          (item: SelectQueueItem, index: number) => ({
            id: item.id,
            position: index
          })
        )
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
      const item = items[status]?.find((i: SelectQueueItem) => i.id === id)
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
    [items, handleAdvance, handleCancel, handleNotify]
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
