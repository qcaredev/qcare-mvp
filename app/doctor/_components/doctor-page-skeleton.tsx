/**
 * @file doctor-page-skeleton.tsx
 *
 * @description
 * A client component that provides a skeleton loading state for the doctor's
 * dashboard. It mimics a list of upcoming patient cards.
 */
"use client"

export function DoctorPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <div className="bg-muted h-8 w-1/3 animate-pulse rounded-md" />
      <div className="space-y-3">
        <div className="bg-muted h-20 w-full animate-pulse rounded-lg" />
        <div className="bg-muted h-20 w-full animate-pulse rounded-lg" />
        <div className="bg-muted h-20 w-full animate-pulse rounded-lg" />
      </div>
    </div>
  )
}
