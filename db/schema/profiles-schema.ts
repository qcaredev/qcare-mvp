/**
 * @file profiles-schema.ts
 *
 * @description
 * Drizzle ORM table definition for **`profiles`**. This table links a user from
 * the authentication provider (Clerk) to their specific role and position within
 * the multi-tenant hierarchy (Organization -> Branch).
 *
 * @columns
 * - userId (text, PK)         : The Clerk user ID.
 * - role (enum)               : The user's application role, determining their permissions.
 * - organizationId (uuid, FK) : The organization the user belongs to.
 * - branchId (uuid, FK)       : The specific branch the user is assigned to.
 * - membership (enum)         : SaaS subscription tier (e.g., free, pro).
 * - stripe...                 : Stripe-related IDs for subscription management.
 * - createdAt / updatedAt     : Standard audit timestamps.
 */
// "use server"

import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { organizationsTable } from "./organization-schema"
import { branchesTable } from "./branches-schema"

/**
 * Defines the possible roles a user can have within the application.
 * - super_admin: Manages an entire organization, including its branches and users.
 * - branch_admin: Manages a specific branch, including its staff.
 * - doctor: Views their queue and manages consultations within a branch.
 * - receptionist: Manages the patient queue for a branch.
 */
export const roleEnum = pgEnum("role", [
  "super_admin",
  "branch_admin",
  "doctor",
  "receptionist"
])

/**
 * Defines the SaaS subscription tier for an organization/user. This is separate
 * from the application role and governs feature access based on payment.
 */
export const membershipEnum = pgEnum("membership", ["free", "pro"])

export const profilesTable = pgTable("profiles", {
  /** The user's ID from the authentication provider (Clerk). Serves as the primary key. */
  userId: text("user_id").primaryKey().notNull(),

  /** The user's role, which dictates their permissions within the application. */
  role: roleEnum("role").notNull(),

  /** Foreign key linking the user to their parent organization. Cascades on delete. */
  organizationId: uuid("organization_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Foreign key linking the user to their assigned branch. Cascades on delete. */
  branchId: uuid("branch_id")
    .references(() => branchesTable.id, { onDelete: "cascade" })
    .notNull(),

  /** The user's SaaS membership status, for billing purposes. */
  membership: membershipEnum("membership").notNull().default("free"),

  /** Stripe-related fields for managing subscriptions. */
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),

  /** Standard audit timestamps. */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/** Drizzle type for inserting a profile record */
export type InsertProfile = typeof profilesTable.$inferInsert
/** Drizzle type for selecting a profile record */
export type SelectProfile = typeof profilesTable.$inferSelect