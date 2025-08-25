/**
 * @file patient-registration-form.tsx
 * @description This client component provides a dialog form for receptionists
 * to register new patients. It handles form state, validation, and calls the
 * server action to add the patient to the queue.
 *
 * @dependencies
 * - `react`, `react-hook-form`, `zod`, `@hookform/resolvers/zod`: For form management and validation.
 * - `lucide-react`: For icons.
 * - `@/components/ui/*`: For UI components from shadcn/ui.
 * - `actions/db/queue-items-actions`: For the server action to register a patient.
 * - `sonner`: For displaying toast notifications.
 */
"use client"

import {
  RegisterPatientInput,
  registerPatientAction
} from "@/actions/db/queue_items_actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Props for the component, requiring the branchId for the server action.
interface PatientRegistrationFormProps {
  branchId: string
}

// Zod schema for form validation.
const formSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters."
  }),
  phone: z.string().optional(),
  reason: z.string().optional()
})

type PatientFormValues = z.infer<typeof formSchema>

export function PatientRegistrationForm({
  branchId
}: PatientRegistrationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      phone: "",
      reason: ""
    }
  })

  /**
   * @function onSubmit
   * @description Handles the form submission logic. It calls the server action
   * and provides user feedback.
   * @param {PatientFormValues} values - The validated form data.
   */
  const onSubmit = (values: PatientFormValues) => {
    startTransition(async () => {
      const data: RegisterPatientInput = {
        ...values,
        branchId
      }

      const result = await registerPatientAction(data)

      if (result.isSuccess) {
        toast.success(result.message)
        setIsOpen(false) // Close the dialog on success
        form.reset() // Reset form for the next entry
        router.refresh() // Refresh server components to show the new patient
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 size-4" />
          Register Patient
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's details below to add them to the queue.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+919876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Fever, cough" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Registering..." : "Register Patient"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
