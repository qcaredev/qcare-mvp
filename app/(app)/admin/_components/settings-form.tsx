/**
 * @file app/(app)/admin/_components/settings-form.tsx
 *
 * @description
 * This client component renders a form for updating branch-specific settings.
 * It uses React Hook Form for state management and Zod for validation.
 * On submission, it calls the `updateBranchSettingsAction` server action.
 *
 * @dependencies
 * - `react-hook-form`, `@hookform/resolvers/zod`: For form handling and validation.
 * - `zod`: For schema validation.
 * - `sonner`: For toast notifications.
 * - `@/actions/db/branch-settings-actions`: For the server action to update settings.
 * - `@/db/schema`: For the `SelectBranchSettings` type.
 * - `@/components/ui/*`: For Shadcn UI components.
 */
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTransition } from "react"
import { toast } from "sonner"

import { updateBranchSettingsAction } from "@/actions/db/branch-settings-actions"
import { SelectBranchSettings } from "@/db/schema"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the Zod schema for form validation.
const settingsFormSchema = z.object({
  alertThreshold: z.coerce
    .number()
    .min(1, "Threshold must be at least 1.")
    .max(10, "Threshold cannot be more than 10."),
  defaultLanguage: z.string().min(2, "Language code is required.")
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

interface SettingsFormProps {
  initialData: SelectBranchSettings
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  // Initialize the form with react-hook-form.
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      alertThreshold: initialData.alertThreshold,
      defaultLanguage: initialData.defaultLanguage
    }
  })

  /**
   * Handles form submission.
   * Calls the server action with the correct arguments and shows a toast notification.
   */
  async function onSubmit(values: SettingsFormValues) {
    startTransition(async () => {
      // Correctly call the action with two separate arguments.
      const result = await updateBranchSettingsAction(initialData.branchId, values)

      if (result.isSuccess) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="alertThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} />
                  </FormControl>
                  <FormDescription>
                    Send a "You're next" reminder when a patient is this many
                    spots away.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., en" {...field} />
                  </FormControl>
                  <FormDescription>
                    Default language for patient communication (e.g., "en", "hi").
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
