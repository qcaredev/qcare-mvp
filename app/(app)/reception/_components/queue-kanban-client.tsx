/**
 * @file queue-kanban-client.tsx
 * @description The main client component for the reception dashboard, including
 * the fix for the DragOverlay props.
 */
"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
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

type ConfirmationState = {
  itemId: string
  patientName: string
  targetStatus: (typeof queueStatusEnum.enumValues)[number]
} | null

export function QueueKanbanClient({
  branchId,
  initialQueueItems
}: QueueKanbanClientProps) {
  const [items, setItems] = useState(initialQueueItems)
  const [activeItem, setActiveItem] = useState<SelectQueueItem | null>(null)
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null)

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

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      if (activeContainer === "WAITLIST" && overContainer === "WAITLIST") {
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
      return
    }

    setConfirmation({
      itemId: activeId,
      patientName: activeItem.patientName,
      targetStatus: overContainer
    })
  }

  const handlePromptAdvance = (
    id: string,
    name: string,
    currentStatus: SelectQueueItem["status"]
  ) => {
    let nextStatus: SelectQueueItem["status"] | undefined
    if (currentStatus === "WAITLIST") nextStatus = "SERVING"
    if (currentStatus === "SERVING") nextStatus = "COMPLETE"

    if (nextStatus) {
      setConfirmation({ itemId: id, patientName: name, targetStatus: nextStatus })
    }
  }

  const handlePromptCancel = (id: string, name: string) => {
    setConfirmation({ itemId: id, patientName: name, targetStatus: "CANCELLED" })
  }

  const executeStatusChange = () => {
    if (confirmation) {
      handleUpdateStatus(confirmation.itemId, confirmation.targetStatus)
      setConfirmation(null)
    }
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
              onPromptAdvance={handlePromptAdvance}
              onPromptCancel={handlePromptCancel}
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
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      
      <AlertDialog
        open={!!confirmation}
        onOpenChange={() => setConfirmation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move{" "}
              <span className="font-semibold text-foreground">
                {confirmation?.patientName}
              </span>{" "}
              to the{" "}
              <span className="font-semibold text-foreground">
                {confirmation?.targetStatus}
              </span>{" "}
              list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeStatusChange}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndContext>
  )
}

function KanbanColumn({
  status,
  items,
  onPromptAdvance,
  onPromptCancel,
  onNotify
}: {
  status: keyof GroupedQueueItems
  items: SelectQueueItem[]
  onPromptAdvance: (
    id: string,
    name: string,
    currentStatus: SelectQueueItem["status"]
  ) => void
  onPromptCancel: (id: string, name: string) => void
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
                onPromptAdvance={onPromptAdvance}
                onPromptCancel={onPromptCancel}
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
