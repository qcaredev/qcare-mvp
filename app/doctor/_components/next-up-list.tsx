/**
 * @file next-up-list.tsx
 *
 * @description
 * This client component displays the list of patients in the 'WAITLIST' for
 * a specific doctor. It includes logic to open a mini-profile dialog for
 * each patient.
 *
 * @props
 * - `items`: An array of `SelectQueueItem` objects representing the patients
 * assigned to the doctor.
 */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectQueueItem } from "@/db/schema"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import MiniProfileDialog from "./mini_profile_dialog"

interface NextUpListProps {
  items: SelectQueueItem[]
}

export default function NextUpList({ items }: NextUpListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectQueueItem | null>(null)

  const handleViewProfileClick = (item: SelectQueueItem) => {
    // DEBUG: Add this log to check if the function is being called.
    console.log("View Profile button clicked for:", item.patientName)

    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl p-4">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">
          Your Upcoming Patients
        </h1>

        {items.length === 0 ? (
          <p className="text-muted-foreground mt-8 text-center">
            You have no patients in the waitlist.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <Card key={item.id} className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.patientName}</span>
                    <span className="text-muted-foreground text-sm font-medium">
                      Waiting for{" "}
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true
                      })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {item.reason || "No reason provided."}
                  </p>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleViewProfileClick(item)}
                    >
                      View Profile
                    </Button>
                    <Button>Start Consult</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MiniProfileDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
      />
    </>
  )
}
