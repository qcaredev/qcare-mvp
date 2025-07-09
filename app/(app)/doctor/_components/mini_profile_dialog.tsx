/**
 * @file mini-profile-dialog.tsx
 *
 * @description
 * A client component that renders a dialog (modal) displaying a concise
 * profile of a patient. It is triggered from the doctor's "next up" list.
 *
 * @props
 * - `item`: The `SelectQueueItem` object for the patient whose profile is to be displayed.
 * - `isOpen`: A boolean to control whether the dialog is open or closed.
 * - `onOpenChange`: A function to handle changes to the dialog's open state.
 *
 * @dependencies
 * - `shadcn/ui`: For Dialog, Badge components.
 * - `lucide-react`: For icons.
 */
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SelectQueueItem } from "@/db/schema"
import { Separator } from "@/components/ui/separator"

interface MiniProfileDialogProps {
  item: SelectQueueItem | null
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function MiniProfileDialog({
  item,
  isOpen,
  onOpenChange
}: MiniProfileDialogProps) {
  if (!item) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.patientName}</DialogTitle>
          <DialogDescription>
            Patient mini-profile. Click outside to close.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold">Chief Complaint</h4>
            <p className="text-muted-foreground">
              {item.reason || "Not specified."}
            </p>
          </div>

          <Separator />

          {/* NOTE: The fields below are placeholders as they are not yet in the DB schema. */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="mb-1 font-semibold">Age</h4>
              <p className="text-muted-foreground">34</p>
            </div>
            <div>
              <h4 className="mb-1 font-semibold">Gender</h4>
              <p className="text-muted-foreground">Female</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Vitals</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">BP: 120/80</Badge>
              <Badge variant="outline">HR: 72 bpm</Badge>
              <Badge variant="outline">Temp: 98.6°F</Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Known Allergies</h4>
            <p className="text-muted-foreground">Penicillin</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Recent Visit</h4>
            <p className="text-muted-foreground">3 months ago for flu</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
