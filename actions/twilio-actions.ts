/**
 * @file twilio-actions.ts
 *
 * @description
 * Server actions for interacting with the Twilio API. This has been updated
 * to support sending both free-form and templated WhatsApp messages.
 */
"use server"

import { ActionState } from "@/types"
import twilio from "twilio"

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_WHATSAPP_FROM

const client = twilio(accountSid, authToken)

interface SendWhatsAppMessageInput {
  to: string
  body?: string // For free-form messages (replies within 24h)
  contentSid?: string // For templates
  contentVariables?: { [key: string]: string } // For template placeholders
}

export async function sendWhatsAppMessageAction({
  to,
  body,
  contentSid,
  contentVariables
}: SendWhatsAppMessageInput): Promise<ActionState<{ sid: string }>> {
  if (!accountSid || !authToken || !fromNumber) {
    const errorMessage = "Twilio credentials are not configured on the server."
    console.error(errorMessage)
    return { isSuccess: false, message: errorMessage }
  }

  if (!body && !contentSid) {
    return {
      isSuccess: false,
      message: "Message failed: You must provide a body or a contentSid."
    }
  }

  try {
    const messageOptions: any = {
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`
    }

    if (contentSid) {
      messageOptions.contentSid = contentSid
      messageOptions.contentVariables = JSON.stringify(contentVariables || {})
    } else {
      messageOptions.body = body
    }

    const message = await client.messages.create(messageOptions)

    return {
      isSuccess: true,
      message: "WhatsApp message sent successfully.",
      data: { sid: message.sid }
    }
  } catch (error) {
    console.error("Error sending WhatsApp message via Twilio:", error)
    const errorMessage =
      error instanceof Error ? error.message : "An unknown Twilio error occurred."
    return {
      isSuccess: false,
      message: `Failed to send WhatsApp message: ${errorMessage}`
    }
  }
}
