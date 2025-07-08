/**
 * @file settings-form.tsx
 *
 * @description
 * A client component form for viewing and updating clinic settings.
 * It uses react-hook-form for state management and Zod for validation.
 */
"use client"

import { updateClinicSettingsAction } from "@/actions/db/clinic-settings-actions"
import { Button } from "@/components/ui/button"
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
import { SelectClinicSettings } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const settingsSchema = z.object({
  alertThreshold: z.coerce.number().min(1, "Must be at least 1"),
  defaultLanguage: z.string().min(2, "Language code is required."),
  whatsappTemplateId: z.string().optional()
})

interface SettingsFormProps {
  clinicId: string
  initialData: SelectClinicSettings | null
}

export function SettingsForm({ clinicId, initialData }: SettingsFormProps) {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      alertThreshold: initialData?.alertThreshold || 3,
      defaultLanguage: initialData?.defaultLanguage || "en",
      whatsappTemplateId: initialData?.whatsappTemplateId || ""
    }
  })

  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    toast.loading("Saving settings...")

    const result = await updateClinicSettingsAction({
      clinicId: clinicId,
      ...values
    })

    if (result.isSuccess) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="alertThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Threshold</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Send a "You're next" reminder when a patient is this many spots
                away.
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
        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  )
}
