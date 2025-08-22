/**
 * @file use-role.ts
 *
 * @description
 * This client-side hook provides an easy way to access the current user's role.
 * It reads the role from the publicMetadata field of the Clerk user object.
 *
 * @dependencies
 * - `@clerk/nextjs`: For the `useUser` hook.
 *
 * @returns
 * An object containing the user's `role` and a boolean `isLoaded` state.
 */
"use client"

import { useUser } from "@clerk/nextjs"

// Define a type for the possible user roles in the application for type safety.
export type UserRole = "admin" | "doctor" | "staff"

export const useRole = () => {
  // The useUser hook provides user data and the loading state.
  const { user, isLoaded } = useUser()

  // The role is stored in the publicMetadata, which is set in the Clerk dashboard.
  const role = user?.publicMetadata?.role as UserRole | null

  return { role, isLoaded }
}