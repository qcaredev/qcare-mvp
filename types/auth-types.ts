/**
 * @file auth-types.ts
 *
 * @description
 * This file extends the default Clerk types to include custom properties
 * that we have added to our user's metadata, such as the `role`. This provides
 * type safety and autocompletion throughout the application for both client
 * and server-side code.
 */

// Define the possible user roles for our application for type safety.
export type UserRole = "admin" | "doctor" | "staff";

declare module "@clerk/nextjs/server" {
  // Augment the `SessionClaims` interface to include our custom `publicMetadata`.
  // This is for server-side code, like the middleware.
  export interface SessionClaims {
    publicMetadata: {
      role?: UserRole;
    };
  }
}
