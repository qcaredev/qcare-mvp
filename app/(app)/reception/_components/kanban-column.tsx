/**
 * @file app/(app)/reception/_components/kanban-column.tsx
 *
 * @description
 * This component renders a single column in the Kanban board. It acts as a
 * droppable area for patient cards and displays the list of patients
 * belonging to its status category.
 *
 * @dependencies
 * - `@dnd-kit/core`: For `useDroppable` hook to make the column a drop target.
 * - `@dnd-kit/sortable`: For `SortableContext` to manage sortable items within.
 * - `@/db/schema`: For the `SelectQueueItem` type.
 * - `./patient-card`: The component used to render each individual patient.
 */
"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SelectQueueItem } from "@/db/schema"
import { PatientCard } from "./patient_card"

interface KanbanColumnProps {
  id: string
  title: string
  items: SelectQueueItem[]
}

export function KanbanColumn({ id, title, items }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col rounded-lg border bg-muted/50"
    >
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="flex flex-grow flex-col gap-2 overflow-y-auto p-2">
        <SortableContext
          id={id}
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.length > 0 ? (
            items.map(item => <PatientCard key={item.id} item={item} />)
          ) : (
            <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed">
              <p className="text-sm text-muted-foreground">No patients</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  )
}
