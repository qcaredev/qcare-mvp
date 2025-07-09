/**
 * @file reception-page-skeleton.tsx
 *
 * @description
 * A client component that provides a skeleton loading state for the reception
 * dashboard. It mimics the layout of the Kanban board to give users an
 * immediate visual feedback while data is being fetched on the server.
 *
 * @notes
 * - Uses `animate-pulse` from Tailwind CSS for a subtle loading animation.
 * - The structure (4 columns) is designed to match the final Kanban layout.
 */
"use client"

export function ReceptionPageSkeleton() {
  return (
    <div className="size-full space-y-4 p-4">
      <div className="bg-muted h-8 w-1/4 animate-pulse rounded-md" />

      <div className="grid size-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted/50 flex flex-col space-y-4 rounded-lg p-4"
          >
            <div className="bg-muted-foreground/20 h-6 w-1/2 animate-pulse rounded-md" />
            <div className="bg-muted-foreground/20 h-24 w-full animate-pulse rounded-lg" />
            <div className="bg-muted-foreground/20 h-24 w-full animate-pulse rounded-lg" />
            <div className="bg-muted-foreground/20 h-24 w-full animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
