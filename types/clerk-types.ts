/**
 * @file clerk-types.ts
 *
 * @description
 * This file extends the default Clerk types to include custom properties
 * that we have added to our user's metadata, such as the `role`. This provides
 * type safety and autocompletion throughout the application.
 */

import type { UserRole } from "@/lib/hooks/use-role"

// Augment the Clerk backend module to include our custom publicMetadata.
// This allows us to access `auth.sessionClaims.publicMetadata.role` in a
// type-safe way within server-side code like middleware.
// Clerk's backend SDK is now "@clerk/types" for type augmentation.
declare module "@clerk/types" {
  interface PublicUserMetadata {
    role?: UserRole
  }
}