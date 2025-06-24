/**
 * @file index.ts
 *
 * @description
 *  Barrel file that re‑exports every Drizzle schema in `db/schema`.
 *  The order of exports is not important but keeping them alphabetical
 *  improves merge resolution.
 */

export * from "./clinics-schema"
export * from "./clinic-settings-schema"
export * from "./consult-history-schema"
export * from "./profiles-schema"
export * from "./queue-items-schema"
