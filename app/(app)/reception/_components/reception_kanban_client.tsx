/**
 * @file app/(app)/reception/_components/reception-kanban-client.tsx
 *
 * @description
 * This client component is responsible for rendering the interactive Kanban
 * board for the Reception Dashboard. It receives the initial queue data
 * from its parent server component.
 *
 * @features
 * - Displays patient cards in columns based on their status.
 * - (Future) Will handle drag-and-drop reordering.
 * - (Future) Will trigger server actions to update patient status.
 *
 * @dependencies
 * - `react`: For state management and hooks.
 * - `@/db/schema`: For the `SelectQueueItem` type.
 */
"use client"

import { SelectQueueItem } from "@/db/schema"

interface ReceptionKanbanClientProps {
  initialQueueItems: SelectQueueItem[]
}

/**
 * Renders the client-side UI for the reception dashboard.
 * @param {ReceptionKanbanClientProps} props - The props containing initial data.
 */
export default function ReceptionKanbanClient({
  initialQueueItems
}: ReceptionKanbanClientProps) {
  // In a future step, we will use this data to render the Kanban board columns
  // (e.g., Waitlist, Serving, Complete).
  // For now, we'll just display the number of patients fetched.

  return (
    <div className="flex-grow rounded-lg border bg-card p-4 text-card-foreground">
      <p>
        Successfully loaded {initialQueueItems.length} patients in the queue.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        (The Kanban board UI will be implemented in a future step.)
      </p>
    </div>
  )
}