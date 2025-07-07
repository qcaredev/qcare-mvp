/**
 * @file queue-kanban.tsx
 *
 * @description
 * This client component will render the main Kanban-style board for the
 * reception dashboard. It receives the initial queue data from the parent
 * server component and will be responsible for rendering the columns and cards,
 * as well as handling user interactions like drag-and-drop.
 *
 * @current_state
 * As of Step 4.1, this is a placeholder component. It simply receives and
 * displays the raw, grouped data to confirm that the data fetching and passing
 * from the server component (`page.tsx`) is working correctly. The full UI and
 * interaction logic will be implemented in a subsequent step.
 *
 * @dependencies
 * - `db/schema`: For `SelectQueueItem` and `queueStatusEnum` types.
 *
 * @props
 * - `initialData`: An object where keys are queue statuses and values are
 * arrays of queue items belonging to that status.
 */
"use client"

import { SelectQueueItem, queueStatusEnum } from "@/db/schema"

/**
 * Defines the shape of the data prop for the Kanban board, where queue items
 * are grouped by their status.
 */
export type GroupedQueueItems = {
  [key in (typeof queueStatusEnum.enumValues)[number]]?: SelectQueueItem[]
}

interface QueueKanbanProps {
  initialData: GroupedQueueItems
}

export default function QueueKanban({ initialData }: QueueKanbanProps) {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Reception Dashboard (WIP)</h1>
      <p>Data successfully passed from server component:</p>
      <pre className="bg-muted mt-2 rounded-lg p-4 text-xs">
        {JSON.stringify(initialData, null, 2)}
      </pre>
    </div>
  )
}
