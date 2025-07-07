/**
 * @file supabase-client.ts
 *
 * @description
 * This file creates and exports a client-side Supabase client instance.
 * This instance is intended for use in client components, particularly for
 * setting up real-time data subscriptions. It uses public environment
 * variables and relies on Supabase's Row Level Security (RLS) for data protection.
 *
 * This is created as a singleton to ensure that only one instance of the
 * Supabase client is used throughout the application on the client side.
 *
 * @dependencies
 * - `@supabase/supabase-js`: The official JavaScript library for Supabase.
 *
 * @configuration
 * Requires the following public environment variables to be set in `.env.local`:
 * - `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
 * - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public "anonymous" key for your project.
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create and export the client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
