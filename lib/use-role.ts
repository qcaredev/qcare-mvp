/**
 * @file lib/use-role.ts
 *
 * @description
 * This client-side custom hook provides an easy way to access the current
 * user's role and check their permissions. It integrates with Clerk's `useUser`
 * hook to read the role from the `publicMetadata` object.
 *
 * @dependencies
 * - `@clerk/nextjs`: Used to get the current user's session and data.
 *
 * @returns
 * An object containing:
 * - `role`: The user's role ("staff", "doctor", "admin") or null if not available.
 * - `isStaff`: A boolean indicating if the user has the "staff" role.
 * - `isDoctor`: A boolean indicating if the user has the "doctor" role.
 * - `isAdmin`: A boolean indicating if the user has the "admin" role.
 * - `isLoading`: A boolean indicating if the user data is still being loaded.
 *
 * @example
 * ```tsx
 * "use client"
 *
 * import { useRole } from "@/lib/use-role";
 *
 * export default function SomeComponent() {
 * const { role, isDoctor, isLoading } = useRole();
 *
 * if (isLoading) {
 * return <div>Loading...</div>;
 * }
 *
 * if (isDoctor) {
 * return <div>Welcome, Doctor!</div>;
 * }
 *
 * return <div>Your role is: {role}</div>
 * }
 * ```
 *
 * @notes
 * - This hook must be used within a component that is a child of `<ClerkProvider>`.
 * - The user's role must be set in the `publicMetadata` field of their Clerk user object.
 * For example: `{ publicMetadata: { role: "doctor" } }`.
 */
"use client"

import { useUser } from "@clerk/nextjs"

/**
 * Defines the possible user roles within the application.
 */
export type UserRole = "staff" | "doctor" | "admin"

/**
 * @function useRole
 * @description A custom hook to get the current user's role from Clerk's public metadata.
 */
export function useRole() {
  const { user, isLoaded } = useUser()

  // While Clerk is loading the user data, return a loading state.
  if (!isLoaded) {
    return {
      role: null,
      isStaff: false,
      isDoctor: false,
      isAdmin: false,
      isLoading: true
    }
  }

  // If the user is not signed in, return null role and false for all checks.
  if (!user) {
    return {
      role: null,
      isStaff: false,
      isDoctor: false,
      isAdmin: false,
      isLoading: false
    }
  }

  // Safely access the role from public metadata.
  const role = user.publicMetadata.role as UserRole | null

  return {
    role,
    isStaff: role === "staff",
    isDoctor: role === "doctor",
    isAdmin: role === "admin",
    isLoading: false
  }
}
