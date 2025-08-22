/**
 * @file app/(app)/reception/_components/reception-kanban-client.tsx
 *
 * @description
 * This client component is the core of the Reception Dashboard. It renders an
 * interactive Kanban board using `@dnd-kit` for drag-and-drop functionality.
 * It manages the patient queue state and triggers server actions on user interaction.
 *
 * @features
 * - Displays patients in columns: "Waitlist", "Serving", "Complete", "Cancelled".
 * - Allows receptionists to drag patient cards between columns to update their status.
 * - Provides optimistic UI updates for a smooth user experience.
 * - Calls server actions to persist changes to the database.
 *
 * @dependencies
 * - `react`: For state management (`useState`, `useMemo`, `useTransition`).
 * - `@dnd-kit/core`: For the main drag-and-drop context and logic.
 * - `@/db/schema`: For the `SelectQueueItem` and `queueStatusEnum` types.
 * - `@/actions/db/queue_items_actions`: For the `updateQueueStatusAction`.
 * - `sonner`: For displaying toast notifications on success or failure.
 * - `./kanban-column`: Component for rendering each column.
 * - `./patient-card`: Component for rendering each draggable patient card.
 */
"use client"

import { useMemo, useState, useTransition } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { SelectQueueItem, queueStatusEnum } from "@/db/schema"
import { updateQueueStatusAction } from "@/actions/db/queue_items_actions"
import { toast } from "sonner"
import { KanbanColumn } from "./kanban-column"
import { PatientCard } from "./patient_card"

// Define the columns for the Kanban board based on the queue status enum.
const columns = [
  { id: "WAITLIST", title: "Waitlist" },
  { id: "SERVING", title: "Serving" },
  { id: "COMPLETE", title: "Complete" },
  { id: "CANCELLED", title: "Cancelled" }
] as const

type ColumnId = (typeof columns)[number]["id"]

interface ReceptionKanbanClientProps {
  initialQueueItems: SelectQueueItem[]
}

export default function ReceptionKanbanClient({
  initialQueueItems
}: ReceptionKanbanClientProps) {
  const [queueItems, setQueueItems] = useState(initialQueueItems)
  const [activeItem, setActiveItem] = useState<SelectQueueItem | null>(null)
  const [isPending, startTransition] = useTransition()

  const patientsByColumn = useMemo(() => {
    const grouped: Record<ColumnId, SelectQueueItem[]> = {
      WAITLIST: [],
      SERVING: [],
      COMPLETE: [],
      CANCELLED: []
    }
    queueItems.forEach(item => {
      if (grouped[item.status as ColumnId]) {
        grouped[item.status as ColumnId].push(item)
      }
    })
    return grouped
  }, [queueItems])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const item = queueItems.find(i => i.id === active.id)
    if (item) {
      setActiveItem(item)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const activeItem = queueItems.find(i => i.id === activeId)
    if (!activeItem) return

    // =================================================================
    // ❗️ KEY FIX: Robustly determine the destination column ID.
    // =================================================================
    // `over.id` could be a column ID or a card ID if dropped on a card.
    // We check the `data` property to find the true parent container.
    const overId = over.id
    const overContainerId =
      over.data.current?.sortable?.containerId || (overId as ColumnId)

    const activeContainerId = activeItem.status as ColumnId

    // Only proceed if the card is dropped in a *different* column.
    if (overContainerId === activeContainerId) return

    // Optimistic UI Update
    setQueueItems(prevItems =>
      prevItems.map(item =>
        item.id === activeId ? { ...item, status: overContainerId } : item
      )
    )

    // Server Action Transition
    startTransition(async () => {
      const result = await updateQueueStatusAction(
        activeId as string,
        overContainerId
      )

      if (result.isSuccess) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
        // Revert UI on failure
        setQueueItems(prevItems =>
          prevItems.map(item =>
            item.id === activeId ? { ...item, status: activeContainerId } : item
          )
        )
      }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {columns.map(col => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            items={patientsByColumn[col.id]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? <PatientCard item={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
