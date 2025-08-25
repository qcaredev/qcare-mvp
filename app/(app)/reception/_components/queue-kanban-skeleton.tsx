/**
 * @file queue-kanban-skeleton.tsx
 * @description A server component that provides a skeleton loading state for the
 * reception dashboard, mimicking the final layout to prevent layout shift.
 *
 * @dependencies
 * - `@/components/ui/skeleton`: The shadcn/ui skeleton component.
 */
"use server"

import { Skeleton } from "@/components/ui/skeleton"

export async function QueueKanbanSkeleton() {
  return (
    <div className="flex h-full flex-col p-4">
      <header className="mb-4 flex items-center justify-between border-b pb-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </header>

      <main className="grid flex-grow grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ColumnSkeleton />
        <ColumnSkeleton />
        <ColumnSkeleton />
        <ColumnSkeleton />
      </main>
    </div>
  )
}

function ColumnSkeleton() {
  return (
    <div className="flex flex-col space-y-3 rounded-lg bg-muted/50 p-2">
      <Skeleton className="h-6 w-3/4 p-2" />
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
