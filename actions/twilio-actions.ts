/**
 * @file twilio-actions.ts
 *
 * @description
 * Server actions for interacting with the Twilio API, specifically for sending
 * WhatsApp messages to patients. This file encapsulates all the logic for
 * communicating with Twilio.
 *
 * @dependencies
 * - `twilio`: The official Twilio Node.js helper library.
 * - `types/server-action-types.ts`: For the `ActionState` return type.
 *
 * @configuration
 * This action requires the following environment variables to be set in `.env.local`:
 * - `TWILIO_SID`: Your Twilio Account SID.
 * - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token.
 * - `TWILIO_WHATSAPP_FROM`: Your Twilio WhatsApp-enabled phone number.
 */
"use server"

import { ActionState } from "@/types"
import twilio from "twilio"

// Initialize Twilio client from environment variables.
const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_WHATSAPP_FROM

// A single Twilio client instance is created and reused.
const client = twilio(accountSid, authToken)

interface SendWhatsAppMessageInput {
  to: string
  body: string
}

/**
 * @function sendWhatsAppMessageAction
 * @description Sends a WhatsApp message using the Twilio API.
 *
 * @param {SendWhatsAppMessageInput} { to, body }
 * - `to`: The recipient's phone number (e.g., "+15551234567").
 * - `body`: The content of the message to be sent.
 *
 * @returns {Promise<ActionState<{ sid: string }>>} An `ActionState` object.
 * - On success: `{ isSuccess: true, message: "...", data: { sid: message.sid } }`
 * - On failure: `{ isSuccess: false, message: "..." }`
 *
 * @logic
 * 1.  Validates that the required Twilio environment variables are available.
 * 2.  Formats the 'to' and 'from' numbers with the required "whatsapp:" prefix.
 * 3.  Calls the Twilio `messages.create` API within a try-catch block.
 * 4.  Handles potential API errors and returns a structured `ActionState` response.
 */
export async function sendWhatsAppMessageAction({
  to,
  body
}: SendWhatsAppMessageInput): Promise<ActionState<{ sid: string }>> {
  // Early return if Twilio credentials are not configured in the environment.
  if (!accountSid || !authToken || !fromNumber) {
    const errorMessage =
      "Twilio credentials are not configured on the server."
    console.error(errorMessage)
    return { isSuccess: false, message: errorMessage }
  }

  try {
    const message = await client.messages.create({
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`,
      body: body
    })

    return {
      isSuccess: true,
      message: "WhatsApp message sent successfully.",
      data: { sid: message.sid }
    }
  } catch (error) {
    console.error("Error sending WhatsApp message via Twilio:", error)
    // The Twilio helper library throws detailed error objects. We extract the
    // message for a more informative response to the caller.
    const errorMessage =
      error instanceof Error ? error.message : "An unknown Twilio error occurred."
    return {
      isSuccess: false,
      message: `Failed to send WhatsApp message: ${errorMessage}`
    }
  }
}