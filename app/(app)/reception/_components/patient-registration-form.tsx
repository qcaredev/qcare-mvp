/**
 * @file patient-registration-form.tsx
 * @description This client component provides a dialog form for receptionists
 * to register new patients. It now includes more patient details and is fully
 * wired up to the backend server action.
 *
 * @dependencies
 * - All previous dependencies.
 * - `actions/db/queue-items-actions`: For the `registerPatientAction`.
 */
"use client"

import {
  RegisterPatientInput,
  registerPatientAction,
} from "@/actions/db/queue_items_actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface PatientRegistrationFormProps {
  branchId: string
}

// Zod schema updated with new fields and coercion for numeric inputs.
const formSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  reason: z.string().optional(),
  age: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  address: z.string().optional(),
})

type PatientFormValues = z.infer<typeof formSchema>

export function PatientRegistrationForm({
  branchId,
}: PatientRegistrationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      phone: "",
      reason: "",
    },
  })

  /**
   * @function onSubmit
   * @description Handles the form submission by calling the server action.
   * @param {PatientFormValues} values - The validated form data.
   */
  const onSubmit = (values: PatientFormValues) => {
    startTransition(async () => {
      const data: RegisterPatientInput = {
        ...values,
        branchId,
      }

      const result = await registerPatientAction(data)

      if (result.isSuccess) {
        toast.success(result.message)
        setIsOpen(false)
        form.reset()
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

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's details below to add them to the queue.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Patient Name*</FormLabel>
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
                <FormItem className="col-span-2">
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+919876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="35" {...field} />
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
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Input placeholder="Fever, cough" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="170" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="75" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main St..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="col-span-2 w-full"
              disabled={isPending}
            >
              {isPending ? "Registering..." : "Register Patient"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
