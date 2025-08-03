You are an AI code generator responsible for implementing a web application based on a provided technical specification and implementation plan.

Your task is to systematically implement each step of the plan, one at a time.

First, carefully review the following inputs:

<project_request>
# Project Name
QCare (working title)

## Project Description
A real-time, WhatsApp-driven queue-tracking system for outpatient departments. Patients get a link showing live position, rolling wait-time estimates, and automatic “your turn is near” alerts. Receptionists advance status with one click, and doctors see a concise mini-profile (Name | Age | Gender | Chief complaint | Vitals | Allergies | Recent visit) before the patient walks in.

## Target Audience
- Small- and mid-size Indian clinics & hospitals (OPD)
- Patients with WhatsApp-enabled phones
- Reception / front-desk staff
- Doctors and nursing staff  
- Hospital administrators / owners (analytics & billing)

## Desired Features
### Patient Experience
- [ ] WhatsApp message upon patient's registration either scanning QR code or receptionist 
- [ ] Live queue position (auto-refresh ≤ 5 s)  
- [ ] Rolling wait-time estimate (simple average of last n consults)  
- [ ] **Alerts** (clinic-configurable)  
    - [ ] **Initial combined message** on registration:<br>“Your estimated wait is **XX min** and you are **#Y** in line.”  
    - [ ] Position-triggered reminder when patient is *N* spots away (default 3) — message reiterates current position & updated wait.  
    - [ ] **Final alert:** “You are **next** – please check in at reception.” 
- [ ] Multilingual UI (tel-IN, en-IN) (If this is technically easy, we can do this)

### Staff Dashboard
- [ ] **Reception view** (four-column board)  
    1. **Bookings** (today’s scheduled appointments)  
    2. **Waitlist** (walk-ins + scheduled now waiting)  
    3. **Serving** (currently with doctor)
    4. **Complete** (completed the appointment; collapsible column)
    5. **Cancelled** (dropped / no-show; collapsible column)  
    - [ ] Patient cards display: **Name • queue # / time • reason • Doctor**  
        - [ ] 🔔 Send “You’re next” reminder  
        - [ ] ✅ Advance state (Waitlist → Serving → Complete → removed from board)  
        - [ ] ❌ Move card to **Cancelled** column  
    - [ ] Drag/arrow re-order **inside Waitlist**; ✅ moves card to next column  
    - [ ] Card drawer (on click): mini-profile, tel: link, wa.me link  
    - [ ] **Priority** badge toggle (gold)  (Might not need this)
- [ ] Doctor view  
    - [ ] Next-up list  
    - [ ] Mini-profile (Name, Age, Gender, Chief complaint, Vitals, Allergies, Recent visit)  
    - [ ] “Start consult” & “Done” buttons

### Admin / Analytics
- [ ] Daily / weekly average wait times (30-day rolling retention)  
- [ ] Priority vs. normal wait metrics  
- [ ] CSV export
- [ ] Clinic settings panel  
    - [ ] Alert threshold (# patients away)  
    - [ ] Default language  
    - [ ] WhatsApp template IDs

### System / Ops
- [ ] **Supabase Postgres + Realtime** (WebSockets)  
- [ ] **Supabase Auth** for authentication & role claims (staff, doctor, admin)  
- [ ] Deployed on Supabase (DB + Edge Functions) and **Vercel** (Next.js UI; serverless cron)  
- [ ] Audit log of status changes  (might not need this) and of application 
- [ ] Encryption at rest & in transit (Supabase default AES-256 / TLS)  
- [ ] REST/GraphQL API scaffold for future apps  

## Design Requests
- [ ] Sidebar nav, top search & filter, four-column Kanban board 
- [ ] Clean cards, rounded corners; icons 🔔 / ✅  
- [ ] Mobile-first responsive (v0.dev components)  
- [ ] Default palette: calm blue & white; open to branding later  

## Other Notes
- Twilio for WhatsApp
- Green-field MVP; no legacy HIS integration  
- Data & analytics retained for 30 days (extendable post-MVP)  
- Future roadmap: ML wait-time prediction, Doctor notes sent to the user (prescription, diagnosis results etc), data-retention policy, multi-tenant SaaS scaling;  Razorpay for billing keeps flow fully India-native  
</project_request>


<project_rules>
# Project Instructions

  

Use specification and guidelines as you build the app.

  

Write the complete code for every step. Do not get lazy.

  

Your goal is to completely finish whatever I ask for.

  

You will see tags in the code. These are context tags that you should use to help you understand the codebase.

  

## Overview

  

This is a web app template.

  

## Tech Stack

  

- Frontend: Next.js, Tailwind, Shadcn, Framer Motion

- Backend: Postgres, Supabase, Drizzle ORM, Server Actions

- Auth: Clerk

- Deployment: Vercel

  

## Project Structure

  

- `actions` - Server actions

- `db` - Database related actions

- Other actions

- `app` - Next.js app router

- `api` - API routes

- `route` - An example route

- `_components` - One-off components for the route

- `layout.tsx` - Layout for the route

- `page.tsx` - Page for the route

- `components` - Shared components

- `ui` - UI components

- `utilities` - Utility components

- `db` - Database

- `schema` - Database schemas

- `lib` - Library code

- `hooks` - Custom hooks

- `prompts` - Prompt files

- `public` - Static assets

- `types` - Type definitions

  

## Rules

  

Follow these rules when building the app.

  

### General Rules

  

- Use `@` to import anything from the app unless otherwise specified

- Use kebab case for all files and folders unless otherwise specified

- Don't update shadcn components unless otherwise specified

  

#### Env Rules

  

- If you update environment variables, update the `.env.example` file

- All environment variables should go in `.env.local`

- Do not expose environment variables to the frontend

- Use `NEXT_PUBLIC_` prefix for environment variables that need to be accessed from the frontend

- You may import environment variables in server actions and components by using `process.env.VARIABLE_NAME`

  

#### Type Rules

  

Follow these rules when working with types.

  

- When importing types, use `@/types`

- Name files like `example-types.ts`

- All types should go in `types`

- Make sure to export the types in `types/index.ts`

- Prefer interfaces over type aliases

- If referring to db types, use `@/db/schema` such as `SelectTodo` from `todos-schema.ts`

  

An example of a type:

  

`types/actions-types.ts`

  

```ts

export type ActionState<T> =

| { isSuccess: true; message: string; data: T }

| { isSuccess: false; message: string; data?: never }

```

  

And exporting it:

  

`types/index.ts`

  

```ts

export * from "./actions-types"

```

  

### Frontend Rules

  

Follow these rules when working on the frontend.

  

It uses Next.js, Tailwind, Shadcn, and Framer Motion.

  

#### General Rules

  

- Use `lucide-react` for icons

- useSidebar must be used within a SidebarProvider

  

#### Components

  

- Use divs instead of other html tags unless otherwise specified

- Separate the main parts of a component's html with an extra blank line for visual spacing

- Always tag a component with either `use server` or `use client` at the top, including layouts and pages

  

##### Organization

  

- All components be named using kebab case like `example-component.tsx` unless otherwise specified

- Put components in `/_components` in the route if one-off components

- Put components in `/components` from the root if shared components

  

##### Data Fetching

  

- Fetch data in server components and pass the data down as props to client components.

- Use server actions from `/actions` to mutate data.

  

##### Server Components


- Use `"use server"` at the top of the file.

- Implement Suspense for asynchronous data fetching to show loading states while data is being fetched.

- If no asynchronous logic is required for a given server component, you do not need to wrap the component in `<Suspense>`. You can simply return the final UI directly since there is no async boundary needed.

- If asynchronous fetching is required, you can use a `<Suspense>` boundary and a fallback to indicate a loading state while data is loading.

- Server components cannot be imported into client components. If you want to use a server component in a client component, you must pass the as props using the "children" prop

- params in server pages should be awaited such as `const { courseId } = await params` where the type is `params: Promise<{ courseId: string }>`

  

Example of a server layout:

  

```tsx

"use server"

  

export default async function ExampleServerLayout({

children

}: {

children: React.ReactNode

}) {

return children

}

```

  

Example of a server page (with async logic):

  

```tsx

"use server"

  

import { Suspense } from "react"

import { SomeAction } from "@/actions/some-actions"

import SomeComponent from "./_components/some-component"

import SomeSkeleton from "./_components/some-skeleton"

  

export default async function ExampleServerPage() {

return (

<Suspense fallback={<SomeSkeleton className="some-class" />}>

<SomeComponentFetcher />

</Suspense>

)

}

  

async function SomeComponentFetcher() {

const { data } = await SomeAction()

return <SomeComponent className="some-class" initialData={data || []} />

}

```

  

Example of a server page (no async logic required):

  

```tsx

"use server"

  

import SomeClientComponent from "./_components/some-client-component"

  

// In this case, no asynchronous work is being done, so no Suspense or fallback is required.

export default async function ExampleServerPage() {

return <SomeClientComponent initialData={[]} />

}

```

  

Example of a server component:

  

```tsx

"use server"

  

interface ExampleServerComponentProps {

// Your props here

}

  

export async function ExampleServerComponent({

props

}: ExampleServerComponentProps) {

// Your code here

}

```

  

##### Client Components

  

- Use `"use client"` at the top of the file

- Client components can safely rely on props passed down from server components, or handle UI interactions without needing <Suspense> if there’s no async logic.

- Never use server actions in client components. If you need to create a new server action, create it in `/actions`

  

Example of a client page:

  

```tsx

"use client"

  

export default function ExampleClientPage() {

// Your code here

}

```

  

Example of a client component:

  

```tsx

"use client"

  

interface ExampleClientComponentProps {

initialData: any[]

}

  

export default function ExampleClientComponent({

initialData

}: ExampleClientComponentProps) {

// Client-side logic here

return <div>{initialData.length} items</div>

}

```

  

### Backend Rules

  

Follow these rules when working on the backend.

  

It uses Postgres, Supabase, Drizzle ORM, and Server Actions.

  

#### General Rules

  

- Never generate migrations. You do not have to do anything in the `db/migrations` folder inluding migrations and metadata. Ignore it.

  

#### Organization

  

#### Schemas

  

- When importing schemas, use `@/db/schema`

- Name files like `example-schema.ts`

- All schemas should go in `db/schema`

- Make sure to export the schema in `db/schema/index.ts`

- Make sure to add the schema to the `schema` object in `db/db.ts`

- If using a userId, always use `userId: text("user_id").notNull()`

- Always include createdAt and updatedAt columns in all tables

- Make sure to cascade delete when necessary

- Use enums for columns that have a limited set of possible values such as:

  

```ts

import { pgEnum } from "drizzle-orm/pg-core"

  

export const membershipEnum = pgEnum("membership", ["free", "pro"])

  

membership: membershipEnum("membership").notNull().default("free")

```

  

Example of a schema:

  

`db/schema/todos-schema.ts`

  

```ts

import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

  

export const todosTable = pgTable("todos", {

id: uuid("id").defaultRandom().primaryKey(),

userId: text("user_id").notNull(),

content: text("content").notNull(),

completed: boolean("completed").default(false).notNull(),

createdAt: timestamp("created_at").defaultNow().notNull(),

updatedAt: timestamp("updated_at")

.defaultNow()

.notNull()

.$onUpdate(() => new Date())

})

  

export type InsertTodo = typeof todosTable.$inferInsert

export type SelectTodo = typeof todosTable.$inferSelect

```

  

And exporting it:

  

`db/schema/index.ts`

  

```ts

export * from "./todos-schema"

```

  

And adding it to the schema in `db/db.ts`:

  

`db/db.ts`

  

```ts

import { todosTable } from "@/db/schema"

  

const schema = { todos: todosTable }

```

  

And a more complex schema:

  

```ts

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

  

export const chatsTable = pgTable("chats", {

id: uuid("id").defaultRandom().primaryKey(),

userId: text("user_id").notNull(),

name: text("name").notNull(),

createdAt: timestamp("created_at").defaultNow().notNull(),

updatedAt: timestamp("updated_at")

.defaultNow()

.notNull()

.$onUpdate(() => new Date())

})

  

export type InsertChat = typeof chatsTable.$inferInsert

export type SelectChat = typeof chatsTable.$inferSelect

```

  

```ts

import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { chatsTable } from "./chats-schema"

  

export const roleEnum = pgEnum("role", ["assistant", "user"])

  

export const messagesTable = pgTable("messages", {

id: uuid("id").defaultRandom().primaryKey(),

chatId: uuid("chat_id")

.references(() => chatsTable.id, { onDelete: "cascade" })

.notNull(),

content: text("content").notNull(),

role: roleEnum("role").notNull(),

createdAt: timestamp("created_at").defaultNow().notNull(),

updatedAt: timestamp("updated_at")

.defaultNow()

.notNull()

.$onUpdate(() => new Date())

})

  

export type InsertMessage = typeof messagesTable.$inferInsert

export type SelectMessage = typeof messagesTable.$inferSelect

```

  

And exporting it:

  

`db/schema/index.ts`

  

```ts

export * from "./chats-schema"

export * from "./messages-schema"

```

  

And adding it to the schema in `db/db.ts`:

  

`db/db.ts`

  

```ts

import { chatsTable, messagesTable } from "@/db/schema"

  

const schema = { chats: chatsTable, messages: messagesTable }

```

  

#### Server Actions

  

- When importing actions, use `@/actions` or `@/actions/db` if db related

- DB related actions should go in the `actions/db` folder

- Other actions should go in the `actions` folder

- Name files like `example-actions.ts`

- All actions should go in the `actions` folder

- Only write the needed actions

- Return an ActionState with the needed data type from actions

- Include Action at the end of function names `Ex: exampleFunction -> exampleFunctionAction`

- Actions should return a Promise<ActionState<T>>

- Sort in CRUD order: Create, Read, Update, Delete

- Make sure to return undefined as the data type if the action is not supposed to return any data

- **Date Handling:** For columns defined as `PgDateString` (or any date string type), always convert JavaScript `Date` objects to ISO strings using `.toISOString()` before performing operations (e.g., comparisons or insertions). This ensures value type consistency and prevents type errors.

  

```ts

export type ActionState<T> =

| { isSuccess: true; message: string; data: T }

| { isSuccess: false; message: string; data?: never }

```

  

Example of an action:

  

`actions/db/todos-actions.ts`

  

```ts

"use server"

  

import { db } from "@/db/db"

import { InsertTodo, SelectTodo, todosTable } from "@/db/schema/todos-schema"

import { ActionState } from "@/types"

import { eq } from "drizzle-orm"

  

export async function createTodoAction(

todo: InsertTodo

): Promise<ActionState<SelectTodo>> {

try {

const [newTodo] = await db.insert(todosTable).values(todo).returning()

return {

isSuccess: true,

message: "Todo created successfully",

data: newTodo

}

} catch (error) {

console.error("Error creating todo:", error)

return { isSuccess: false, message: "Failed to create todo" }

}

}

  

export async function getTodosAction(

userId: string

): Promise<ActionState<SelectTodo[]>> {

try {

const todos = await db.query.todos.findMany({

where: eq(todosTable.userId, userId)

})

return {

isSuccess: true,

message: "Todos retrieved successfully",

data: todos

}

} catch (error) {

console.error("Error getting todos:", error)

return { isSuccess: false, message: "Failed to get todos" }

}

}

  

export async function updateTodoAction(

id: string,

data: Partial<InsertTodo>

): Promise<ActionState<SelectTodo>> {

try {

const [updatedTodo] = await db

.update(todosTable)

.set(data)

.where(eq(todosTable.id, id))

.returning()

  

return {

isSuccess: true,

message: "Todo updated successfully",

data: updatedTodo

}

} catch (error) {

console.error("Error updating todo:", error)

return { isSuccess: false, message: "Failed to update todo" }

}

}

  

export async function deleteTodoAction(id: string): Promise<ActionState<void>> {

try {

await db.delete(todosTable).where(eq(todosTable.id, id))

return {

isSuccess: true,

message: "Todo deleted successfully",

data: undefined

}

} catch (error) {

console.error("Error deleting todo:", error)

return { isSuccess: false, message: "Failed to delete todo" }

}

}

```

  

### Auth Rules

  

Follow these rules when working on auth.

  

It uses Clerk for authentication.

  

#### General Rules

  

- Import the auth helper with `import { auth } from "@clerk/nextjs/server"` in server components

- await the auth helper in server actions

  

# Storage Rules

  

Follow these rules when working with Supabase Storage.

  

It uses Supabase Storage for file uploads, downloads, and management.

  

## General Rules

  

- Always use environment variables for bucket names to maintain consistency across environments

- Never hardcode bucket names in the application code

- Always handle file size limits and allowed file types at the application level

- Use the `upsert` method instead of `upload` when you want to replace existing files

- Always implement proper error handling for storage operations

- Use content-type headers when uploading files to ensure proper file handling

  

## Organization

  

### Buckets

  

- Name buckets in kebab-case: `user-uploads`, `profile-images`

- Create separate buckets for different types of files (e.g., `profile-images`, `documents`, `attachments`)

- Document bucket purposes in a central location

- Set appropriate bucket policies (public/private) based on access requirements

- Implement RLS (Row Level Security) policies for buckets that need user-specific access

- Make sure to let me know instructions for setting up RLS policies on Supabase since you can't do this yourself, including the SQL scripts I need to run in the editor

  

### File Structure

  

- Organize files in folders based on their purpose and ownership

- Use predictable, collision-resistant naming patterns

- Structure: `{bucket}/{userId}/{purpose}/{filename}`

- Example: `profile-images/123e4567-e89b/avatar/profile.jpg`

- Include timestamps in filenames when version history is important

- Example: `documents/123e4567-e89b/contracts/2024-02-13-contract.pdf`

  

## Actions

  

- When importing storage actions, use `@/actions/storage`

- Name files like `example-storage-actions.ts`

- Include Storage at the end of function names `Ex: uploadFile -> uploadFileStorage`

- Follow the same ActionState pattern as DB actions

  

Example of a storage action:

  

```ts

"use server"

  

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { ActionState } from "@/types"

  

export async function uploadFileStorage(

bucket: string,

path: string,

file: File

): Promise<ActionState<{ path: string }>> {

try {

const supabase = createClientComponentClient()

  

const { data, error } = await supabase.storage

.from(bucket)

.upload(path, file, {

upsert: false,

contentType: file.type

})

  

if (error) throw error

  

return {

isSuccess: true,

message: "File uploaded successfully",

data: { path: data.path }

}

} catch (error) {

console.error("Error uploading file:", error)

return { isSuccess: false, message: "Failed to upload file" }

}

}

```

  

## File Handling

  

### Upload Rules

  

- Always validate file size before upload

- Implement file type validation using both extension and MIME type

- Generate unique filenames to prevent collisions

- Set appropriate content-type headers

- Handle existing files appropriately (error or upsert)

  

Example validation:

  

```ts

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

  

function validateFile(file: File): boolean {

if (file.size > MAX_FILE_SIZE) {

throw new Error("File size exceeds limit")

}

  

if (!ALLOWED_TYPES.includes(file.type)) {

throw new Error("File type not allowed")

}

  

return true

}

```

  

### Download Rules

  

- Always handle missing files gracefully

- Implement proper error handling for failed downloads

- Use signed URLs for private files

  

### Delete Rules

  

- Implement soft deletes when appropriate

- Clean up related database records when deleting files

- Handle bulk deletions carefully

- Verify ownership before deletion

- Always delete all versions/transforms of a file

  

## Security

  

### Bucket Policies

  

- Make buckets private by default

- Only make buckets public when absolutely necessary

- Use RLS policies to restrict access to authorized users

- Example RLS policy:

  

```sql

CREATE POLICY "Users can only access their own files"

ON storage.objects

FOR ALL

USING (auth.uid()::text = (storage.foldername(name))[1]);

```

  

### Access Control

  

- Generate short-lived signed URLs for private files

- Implement proper CORS policies

- Use separate buckets for public and private files

- Never expose internal file paths

- Validate user permissions before any operation

  

## Error Handling

  

- Implement specific error types for common storage issues

- Always provide meaningful error messages

- Implement retry logic for transient failures

- Log storage errors separately for monitoring

  

## Optimization

  

- Implement progressive upload for large files

- Clean up temporary files and failed uploads

- Use batch operations when handling multiple files
</project_rules>

<technical_specification>
# QCare Technical Specification

## 1. System Overview
- **Core Purpose and Value Proposition**  
  QCare optimizes outpatient department (OPD) queues by offering real-time position tracking, rolling wait-time estimates, and WhatsApp notifications. Patients stay informed without physically waiting, staff manage a streamlined Kanban board, doctors see concise patient details, and administrators get analytics on wait times.

- **Key Workflows**  
  1. **Patient Registration**  
     - Reception registers patient (or patient scans QR) → record is created in `queue_items` with status WAITLIST.  
     - Twilio WhatsApp message is sent with “#Y in line, estimated wait XX min.”  
  2. **Queue Management**  
     - Reception has a Kanban board with columns Bookings, Waitlist, Serving, Complete, Cancelled.  
     - They reorder via drag-and-drop, send a “You’re next” reminder, or move to next column.  
  3. **Doctor Consultation**  
     - Doctors see next-up patients, start consult → WAITLIST → SERVING. Then mark complete → RECORD consult in `consult_history`.  
  4. **Admin & Analytics**  
     - Aggregated wait times, daily/weekly stats, CSV export, clinic settings (like alert thresholds).

- **System Architecture**  
  - **Frontend**: Next.js + Tailwind + Shadcn UI.  
  - **Backend**: Supabase (Postgres + Realtime) with Drizzle for DB queries, Twilio for WhatsApp.  
  - **Auth**: The code template uses Clerk; project requirements specify Supabase Auth for roles.  
  - **Deployment**: Vercel for UI, Supabase for DB/Realtime/Edge Functions.

## 2. Project Structure
- **Actions Folder**  
  - `actions/db/` for database actions (queue actions, consult history, etc.).  
  - `actions/twilio-actions.ts` for sending WhatsApp messages.  

- **App Folder**  
  - `(auth)/` for sign in/up (Clerk-based in template, might adapt to Supabase).  
  - `queue/` for staff’s reception dashboard.  
    - `page.tsx`, `_components/queue-kanban.tsx`, etc.  
  - `doctor/` for doctor’s next-up list.  
  - `admin/` for analytics and clinic settings.  

- **DB Folder**  
  - `schema/` with definitions for `clinics`, `queue_items`, `consult_history`, `clinic_settings`.  
  - `db.ts` to initialize and export the drizzle client.  

- **Components**  
  - Shared UI components in `components/` (e.g., form controls, shared modals, etc.).  

## 3. Feature Specification

### 3.1 Patient Experience
- **User Story & Requirements**  
  - Patients receive a WhatsApp message upon registration with their queue position and a rolling wait-time estimate.  
  - Automatic updates at certain intervals or triggered by status changes.  
  - “You’re next” alert when position ≤ threshold.  
  - Possibly multilingual (English, Hindi).  

- **Detailed Implementation Steps**  
  1. **Registration**: Insert row into `queue_items` with `WAITLIST` status.  
  2. **Send WhatsApp**: Twilio action that composes text: “You are #Y in line, approx. XX minutes.”  
  3. **Auto-Refresh**: Either a small Next.js page that polls or uses Supabase Realtime to show updated position.  
  4. **Threshold Alerts**: On queue reorder or status change, if patient’s position is N or less, automatically send a reminder.  

- **Error Handling & Edge Cases**  
  - Invalid phone number or Twilio fail → logs an error, staff sees a “failed to send” message.  
  - Drastic reorder can move the patient significantly → ensure newly computed position is always correct.

### 3.2 Staff Dashboard (Reception)
- **User Story & Requirements**  
  - Kanban columns: Bookings (scheduled appointments), Waitlist (walk-ins + waiting scheduled), Serving, Complete, Cancelled.  
  - Patient card with name, queue #, reason, doctor assignment, quick actions.  
  - Reorder within Waitlist, and transitions to next column (Serving → Complete, etc.).  

- **Detailed Implementation Steps**  
  1. **Display**: Query `queue_items` grouped by `status`.  
  2. **Actions**: 
     - “You’re next” → Twilio message.  
     - “Advance” → calls updateQueueStatusAction from WAITLIST to SERVING, or from SERVING to COMPLETE, etc.  
     - “Cancel” → sets `status = CANCELLED`.  
  3. **Reordering**: reorderQueueAction updates positions. Possibly store numeric `position` in the DB.  

- **Error Handling & Edge Cases**  
  - Simultaneous reorders by multiple staff → accept last-in-wins or use a transaction approach.  
  - If the patient’s phone is missing, “You’re next” is disabled.

### 3.3 Doctor View
- **User Story & Requirements**  
  - Doctors see a sorted list of WAITLIST items assigned to them.  
  - A mini-profile shows quick details (age, gender, vitals, allergies, reason, etc.).  
  - “Start consult” → moves item to SERVING, “Done” → moves item to COMPLETE, logs consult time in `consult_history`.  

- **Detailed Implementation Steps**  
  1. **Query**: Filter queue items by `doctorId = currentDoctorId` and `status = WAITLIST`.  
  2. **Start Consult**: updateQueueStatusAction from WAITLIST to SERVING, store the start time.  
  3. **Finish Consult**: updateQueueStatusAction from SERVING to COMPLETE, compute durations for analytics.  

- **Error Handling & Edge Cases**  
  - If the item is no longer in WAITLIST or cancelled, show an error or refresh.  
  - Potential concurrency if staff tries to move the patient at the same time.

### 3.4 Admin / Analytics
- **User Story & Requirements**  
  - Compute daily or weekly average wait times, track normal vs. priority, store data for 30 days.  
  - CSV export of queue stats or consult times.  
  - Clinic settings for alert thresholds and default language.  

- **Detailed Implementation Steps**  
  1. **Analytics**: Summaries from `consult_history` (like average wait, average consult time).  
  2. **Priority vs. Normal**: If a “priority” toggle is used, record that in queue items. Compare wait times.  
  3. **CSV Export**: Query consult_history for last 30 days and produce CSV.  
  4. **Settings**: Manage `clinic_settings` (alertThreshold, defaultLanguage, etc.).  

- **Error Handling & Edge Cases**  
  - If data is large, implement pagination or streaming for CSV.  
  - If no consult history found, show placeholders or zero stats.

## 4. Database Schema

### 4.1 Tables

#### clinicsTable
- **Fields**  
  - id (uuid, PK, defaultRandom)  
  - name (text, not null)  
  - createdAt (timestamp, defaultNow, not null)  
  - updatedAt (timestamp, defaultNow, not null, onUpdate now)  

- **Relationships and Indexes**  
  - Primary key on id.  
  - Potentially index name.  

#### queueItemsTable
- **Fields**  
  - id (uuid, PK, defaultRandom)  
  - clinicId (uuid, references clinics.id, onDelete:cascade, not null)  
  - patientName (text, not null)  
  - phone (text)  
  - reason (text)  
  - status (enum WAITLIST, SERVING, COMPLETE, CANCELLED) default WAITLIST  
  - position (int) default 0  
  - doctorId (text)  
  - createdAt (timestamp, defaultNow, not null)  
  - updatedAt (timestamp, defaultNow, not null, onUpdate now)  

- **Relationships and Indexes**  
  - Index (clinicId, position) for sorting waitlists.  
  - Cascade if clinic is removed.

#### consultHistoryTable
- **Fields**  
  - id (uuid, PK, defaultRandom)  
  - queueItemId (uuid, not null)  
  - clinicId (uuid, not null)  
  - waitDurationSeconds (int, not null)  
  - consultDurationSeconds (int, not null)  
  - createdAt (timestamp, defaultNow, not null)  

- **Relationships and Indexes**  
  - Optionally reference queueItemId → onDelete:cascade.  
  - Index (clinicId, createdAt) for analytics.

#### clinicSettingsTable
- **Fields**  
  - id (uuid, PK, defaultRandom)  
  - clinicId (uuid, references clinics.id, onDelete:cascade, not null)  
  - alertThreshold (int, default 3)  
  - defaultLanguage (text, default 'en')  
  - whatsappTemplateId (text)  
  - createdAt (timestamp, defaultNow, not null)  
  - updatedAt (timestamp, defaultNow, not null, onUpdate now)  

- **Relationships and Indexes**  
  - One row per clinic.  
  - Index clinicId.

## 5. Server Actions

### 5.1 Database Actions

#### createQueueItemAction
- **Description**  
  Inserts a new record into queueItemsTable for a patient.  

- **Input/Return**  
  - Input: clinicId, patientName, optional phone, reason, doctorId.  
  - Returns: newly created queue item.  

- **ORM**  
  - Insert row with status = WAITLIST, position = last position + 1.  
  - Return the inserted row.

#### reorderQueueAction
- **Description**  
  Reorders items in the Waitlist by updating position.  

- **Input/Return**  
  - Input: clinicId, newOrder array of { id, position }.  
  - Return: success or updated items.  

- **ORM**  
  - Possibly run multiple updates in a transaction to set new positions.

#### updateQueueStatusAction
- **Description**  
  Moves an item from WAITLIST → SERVING → COMPLETE → CANCELLED.  

- **Input/Return**  
  - Input: queueItemId, newStatus.  
  - Return: updated queue item.  

- **ORM**  
  - Update queueItemsTable status.  
  - If newStatus = COMPLETE, record consult time in consultHistoryTable.

### 5.2 Other Actions

- **Twilio Integration**  
  - Endpoint: https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json  
  - Basic Auth with Twilio SID and Token.  
  - Data format: JSON with `Body`, `From`, `To`.  

- **File Handling Procedures**  
  - None major for this MVP, unless storing attachments in the future.  

- **Data Processing Algorithms**  
  - Rolling average consult time: compute from the last N consultHistory entries.  
  - “You’re next” alert threshold logic.

## 6. Design System

### 6.1 Visual Style
- **Color Palette**  
  - Primary: #0084FF  
  - Secondary: #00C49F  
  - Background: #FFFFFF  
  - Foreground: #333333  
  - Muted: #F5F5F5  
  - Danger: #DC3545  

- **Typography**  
  - Use Inter or similar. Headings are bold, body text normal.  

- **Component Styling Patterns**  
  - Cards with `rounded-lg shadow-sm`.  
  - Buttons with hover states.  

- **Spacing and Layout Principles**  
  - Use Tailwind defaults, `.container mx-auto px-4`.  
  - Mobile-first, responsive grids.

### 6.2 Core Components
- **Layout Structure**  
  - Common Header, optional Sidebar for staff or doctor.  
  - Footer with branding.  

- **Navigation Patterns**  
  - Top-level marketing site, side or top nav for logged-in staff/doctor.  

- **Shared Components**  
  - `<QueueCard>`: displays patient data, onClick for next steps.  
  - `<MiniProfileDialog>`: details about the patient.  

- **Interactive States**  
  - Hover: slightly lighten or darken background.  
  - Disabled: reduce opacity.  

## 7. Component Architecture

### 7.1 Server Components
- **Data Fetching Strategy**  
  - Use Drizzle or server actions in the server page; pass results down as props.  

- **Suspense Boundaries**  
  - If an async operation is needed, wrap in `<Suspense> fallback={<Skeleton/>}>`.  

- **Error Handling**  
  - Return an error page or fallback if DB fetch fails.  

- **Props Interface**  
  - Example: 
    - interface QueuePageProps { clinicId: string }

### 7.2 Client Components
- **State Management Approach**  
  - Minimal local state, or use React Query / Supabase client for real-time updates.  

- **Event Handlers**  
  - `onReorder` calls reorderQueueAction, `onNotify` calls Twilio action.  

- **UI Interactions**  
  - Clicking a card to open a mini-profile, dragging items in Waitlist, etc.  

- **Props Interface**  
  - Example:
    - interface QueueKanbanProps { waitlist: QueueItem[]; onReorder(...): void; }

## 8. Authentication & Authorization
- **Clerk Implementation Details**  
  - The existing template uses Clerk for sign-up/in and server middleware.  
  - QCare might replace or unify it with Supabase Auth, storing roles in user metadata.  

- **Protected Routes Configuration**  
  - A middleware or server action checks if the user is staff or doctor.  
  - If unauthorized, redirect to login.  

- **Session Management Strategy**  
  - Clerk by default uses cookies; with Supabase, store JWT or session tokens.  

## 9. Data Flow
- **Server/Client Data Passing Mechanisms**  
  - Next.js server components fetch DB data, pass as props to client components.  

- **State Management Architecture**  
  - Minimal client global state.  
  - Supabase Realtime or polling for frequent updates to queue data.

## 10. PostHog Analytics
- **Analytics Strategy**  
  - Track events like patient_registered, consult_completed, reorder_queue.  
  - Tag them with clinicId or user role for segmentation.  

- **Event Tracking Implementation**  
  - Possibly a server action that calls PostHog.  
  - Alternatively, embed a client snippet.  

- **Custom Property Definitions**  
  - clinic_id, queue_item_id, role, etc.

## 11. Testing
- **Unit Tests with Jest**  
  - Example: createQueueItemAction.test checks DB insertion correctness.  
  - reorderQueueAction.test tests position updates.  
  - Twilio action test mocks the sendWhatsApp call.  

- **e2e Tests with Playwright**  
  - **Reception Flow**: staff logs in, registers patient, moves from WAITLIST to COMPLETE.  
  - **Doctor Flow**: doctor sees next-up list, starts consult, finishes consult.  
  - **Alerts**: test “You’re next” triggers Twilio.  

</technical_specification>

<implementation_plan>

# Implementation Plan

## 0 – Bootstrap & Configuration
- [X] **Step 0.1: Install runtime dependencies**
- [X] **Step 0.2: Extend environment variables**

## 1 – Database Schema
- [X] **Step 1.1: Define enums & tables**
- [X] **Step 1.2: SQL for RLS & Realtime**

## 2 – Server Actions (Database)
- [X] **Step 2.1: createQueueItemAction**
- [X] **Step 2.2: reorderQueueAction**
- [X] **Step 2.3: updateQueueStatusAction**

## 3 – Server Actions (Twilio)
- [X] **Step 3.1: sendWhatsAppMessageAction**

## 4 – Reception Dashboard
- [X] **Step 4.1: Route & Server Page**
- [X] **Step 4.2: Kanban Client Component**
- [X] **Step 4.3: Queue Mutations Hooks**

## 5 – Doctor Dashboard
- [X] **Step 5.1: Route & Server Page**
- [X] **Step 5.2: Mini-Profile Dialog**

## 6 – Patient Public Page
- [X] **Step 6.1: Route**

## 7 – Supabase Realtime Integration
- [X] **Step 7.1: Realtime client util**
- [X] **Step 7.2: Hook in dashboards**

## 8 – Admin & Analytics
- [X] **Step 8.1: Analytics queries**
  - **Task**: `actions/db/analytics-actions.ts` – daily avg wait, CSV export.
  - **Files**:  
    - `actions/db/analytics-actions.ts`
  - **Step Dependencies**: 2.3

- [X] **Step 8.2: Admin page**
  - **Task**: `app/admin/page.tsx` – charts with recharts, CSV download button.
  - **Files**:  
    - `app/admin/page.tsx`
  - **Step Dependencies**: 8.1

## 9 – Settings Panel
- [X] **Step 9.1: Clinic settings CRUD**
  - **Task**: Server actions + simple form to update alert threshold & language.
  - **Files**:  
    - `actions/db/clinic-settings-actions.ts`
    - `app/admin/_components/settings-form.tsx`
  - **Step Dependencies**: 1.1, 8.2

## 10 – Auth & Authorization Enhancements
- [X] **Step 10.1: Role claims helper**
  - **Task**: Add `lib/use-role.ts` (reads Clerk public metadata for role: staff, doctor, admin).
  - **Files**:  
    - `lib/use-role.ts`
  - **Step Dependencies**: none (can run anytime before protected pages)

- [ ] **Step 10.2: Protected route middleware update**
  - **Task**: Extend `middleware.ts` to guard `/reception`, `/doctor`, `/admin` by role.
  - **Files**:  
    - `middleware.ts`
  - **Step Dependencies**: 10.1

## 11 – Notifications Logic
- [ ] **Step 11.1: Automatic “You’re next” trigger**
  - **Task**: In `updateQueueStatusAction` and `reorderQueueAction`, detect position ≤ threshold & call Twilio action.
  - **Files**:  
    - `actions/db/queue-items-actions.ts`
  - **Step Dependencies**: 3.1

## 12 – Unit & e2e Testing
- [ ] **Step 12.1: Jest unit tests for server actions**
  - **Task**: tests for queue actions & Twilio action (mocked).
  - **Files**:  
    - `tests/createQueueItemAction.test.ts`
    - `tests/updateQueueStatusAction.test.ts`
  - **Step Dependencies**: 2.3, 3.1

- [ ] **Step 12.2: Playwright e2e**
  - **Task**: scenarios: Reception flow, Doctor flow, Alert triggered.
  - **Files**:  
    - `playwright.config.ts`
    - `tests/e2e/*`
  - **Step Dependencies**: 4.3, 5.2, 11.1

## 13 – Deployment Notes
- [ ] **Step 13.1: Vercel & Supabase set‑up guide**
  - **Task**: Markdown doc `DEPLOY.md` with env var list, Supabase SQL snippets, Twilio Sandbox config.
  - **Files**:  
    - `DEPLOY.md`
  - **Step Dependencies**: all previous steps

### Summary

The plan proceeds from foundational setup through back‑end schema & actions, then outward to UI features for each user role, real‑time updates, notifications, analytics, testing, and deployment documentation. Each step is atomic (≤ 20 files), ordered to satisfy dependencies, and includes clear instructions for any manual tasks (migration, RLS, environment variables, package installs). This sequence enables a code‑generation system to implement QCare incrementally, validating each layer before proceeding to the next.

</implementation_plan>

<existing_code>

<file_map>
/Users/dev/Desktop/project/qcare-mvp
├── actions
│   ├── db
│   │   ├── analytics-actions.ts
│   │   ├── consult_history_actions.ts
│   │   ├── profiles-actions.ts
│   │   └── queue_items_actions.ts
│   ├── stripe-actions.ts
│   └── twilio-actions.ts
├── app
│   ├── (auth)
│   │   ├── login
│   │   │   └── [[...login]]
│   │   │       └── page.tsx
│   │   ├── signup
│   │   │   └── [[...signup]]
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── api
│   │   └── stripe
│   │       └── webhooks
│   │           └── route.ts
│   ├── q
│   │   └── [queueId]
│   │       ├── _components
│   │       │   └── patient-queue-view.tsx
│   │       └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components
│   ├── landing
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── hero.tsx
│   ├── magicui
│   │   ├── animated-gradient-text.tsx
│   │   └── hero-video-dialog.tsx
│   └── utilities
│       ├── providers.tsx
│       ├── tailwind-indicator.tsx
│       └── theme-switcher.tsx
├── db
│   ├── schema
│   │   ├── clinic-settings-schema.ts
│   │   ├── clinics-schema.ts
│   │   ├── consult-history-schema.ts
│   │   ├── index.ts
│   │   ├── profiles-schema.ts
│   │   └── queue-items-schema.ts
│   └── db.ts
├── lib
│   ├── hooks
│   │   ├── use-copy-to-clipboard.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── stripe.ts
│   ├── supabase-client.ts
│   └── utils.ts
├── types
│   ├── index.ts
│   └── server-action-types.ts
├── .eslintrc.json
├── .gitignore
├── components.json
├── drizzle.config.ts
├── license
├── middleware.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── prettier.config.cjs
├── tailwind.config.ts
└── tsconfig.json

</file_map>

<file_contents>
File: /Users/dev/Desktop/project/qcare-mvp/middleware.ts
import { authMiddleware } from "@clerk/nextjs/server";

// This is the simplest and most robust way to configure Clerk middleware for the packages we've installed.
// It protects all routes by default.
// Public routes are exempted via the publicRoutes array.
export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/features",
    "/pricing",
    "/q/(.*)", // Public patient tracking page (e.g., /q/some-id)
    "/api/stripe/webhooks",
  ],
});

export const config = {
  // The matcher ensures that the middleware runs on all routes except for
  // static assets and Next.js-specific paths.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};


File: /Users/dev/Desktop/project/qcare-mvp/license
MIT License

Copyright (c) 2025 Mckay Wrigley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

File: /Users/dev/Desktop/project/qcare-mvp/postcss.config.mjs
/*
Configures PostCSS for the app.
*/

/** @type {import('postcss-load-config').Config} */
const config = { plugins: { tailwindcss: {} } }

export default config


File: /Users/dev/Desktop/project/qcare-mvp/next.config.mjs
/*
Configures Next.js for the app.
*/

/** @type {import('next').NextConfig} */
const nextConfig = { images: { remotePatterns: [{ hostname: "localhost" }] } }

export default nextConfig


File: /Users/dev/Desktop/project/qcare-mvp/tailwind.config.ts
/*
Configures Tailwind CSS for the app.
*/

import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        gradient: { to: { backgroundPosition: "var(--bg-size) 0" } }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gradient: "gradient 8s linear infinite"
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/postcss")
  ]
} satisfies Config

export default config


File: /Users/dev/Desktop/project/qcare-mvp/.gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env*.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# clerk configuration (can include secrets)
/.clerk/


File: /Users/dev/Desktop/project/qcare-mvp/package.json
{
  "name": "qcare-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "npm run lint:fix && npm run format:write",
    "type-check": "tsc --noEmit",
    "lint:fix": "next lint --fix",
    "format:write": "prettier --write \"{app,lib,db,components,context,types}/**/*.{ts,tsx}\" --cache",
    "format:check": "prettier --check \"{app,lib,db,components,context,types}**/*.{ts,tsx}\" --cache",
    "analyze": "ANALYZE=true npm run build",
    "db:generate": "npx drizzle-kit generate",
    "db:migrate": "npx drizzle-kit migrate",
    "test": "echo \"No test specified\" && exit 0",
    "prepare": "husky install"
  },
  "dependencies": {
    "@clerk/backend": "^1.24.0",
    "@clerk/nextjs": "^5.7.5",
    "@clerk/themes": "^2.2.17",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^8.0.0",
    "@hookform/resolvers": "^4.0.0",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-aspect-ratio": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-context-menu": "^2.2.6",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-hover-card": "^1.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-navigation-menu": "^1.2.5",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-toggle": "^1.1.2",
    "@radix-ui/react-toggle-group": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@supabase/supabase-js": "^2.50.0",
    "@tailwindcss/postcss": "^4.0.6",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.4",
    "csv-stringify": "^6.6.0",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.39.3",
    "embla-carousel-react": "^8.5.2",
    "framer-motion": "^12.4.2",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.475.0",
    "next": "^14.2.4",
    "next-themes": "^0.4.4",
    "postcss": "^8.5.2",
    "postgres": "^3.4.5",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.1",
    "sonner": "^1.7.4",
    "stripe": "^17.6.0",
    "tailwind-merge": "^3.0.1",
    "tailwindcss": "^3.4.17",
    "tailwindcss-animate": "^1.0.7",
    "twilio": "^3.84.1",
    "vaul": "^1.1.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "dotenv": "^16.4.7",
    "drizzle-kit": "^0.30.4",
    "eslint": "^9",
    "eslint-config-next": "15.1.7",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-tailwindcss": "^3.18.0",
    "husky": "^8.0.0",
    "prettier": "^3.5.0",
    "typescript": "^5"
  }
}


File: /Users/dev/Desktop/project/qcare-mvp/prettier.config.cjs
/*
Configures Prettier for the app.
*/

/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  semi: false,
  useTabs: false,
  singleQuote: false,
  arrowParens: "avoid",
  tabWidth: 2,
  trailingComma: "none",
  importOrder: [
    "^.+\\.scss$",
    "^.+\\.css$",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/registry/(.*)$",
    "^@/styles/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]"
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true
}


File: /Users/dev/Desktop/project/qcare-mvp/components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/lib/hooks"
  }
}


File: /Users/dev/Desktop/project/qcare-mvp/tsconfig.json
/*
Configures the TypeScript compiler options for the app.
*/

{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] },
    "target": "ES2017"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}


File: /Users/dev/Desktop/project/qcare-mvp/drizzle.config.ts
/*
Configures Drizzle for the app.
*/

import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local" })

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! }
})


File: /Users/dev/Desktop/project/qcare-mvp/.eslintrc.json
/*
Contains the ESLint configuration for the app.
*/

{
  "$schema": "https://json.schemastore.org/eslintrc",
  "root": true,
  "extends": [
    "next/core-web-vitals",
    "prettier",
    "plugin:tailwindcss/recommended"
  ],
  "plugins": ["tailwindcss"],
  "rules": {
    "@next/next/no-img-element": "off",
    "jsx-a11y/alt-text": "off",
    "react-hooks/exhaustive-deps": "off",
    "tailwindcss/enforces-negative-arbitrary-values": "off",
    "tailwindcss/no-contradicting-classname": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/no-unnecessary-arbitrary-value": "off",
    "react/no-unescaped-entities": "off"
  },
  "settings": {
    "tailwindcss": { "callees": ["cn", "cva"], "config": "tailwind.config.ts" }
  },
  "overrides": [
    { "files": ["*.ts", "*.tsx"], "parser": "@typescript-eslint/parser" }
  ]
}


File: /Users/dev/Desktop/project/qcare-mvp/types/server-action-types.ts
/*
Contains the general server action types.
*/

export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }


File: /Users/dev/Desktop/project/qcare-mvp/types/index.ts
/*
Exports the types for the app.
*/

export * from "./server-action-types"


File: /Users/dev/Desktop/project/qcare-mvp/actions/twilio-actions.ts
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

File: /Users/dev/Desktop/project/qcare-mvp/actions/stripe-actions.ts
/*
Contains server actions related to Stripe.
*/

import {
  updateProfileAction,
  updateProfileByStripeCustomerIdAction
} from "@/actions/db/profiles-actions"
import { SelectProfile } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

type MembershipStatus = SelectProfile["membership"]

const getMembershipStatus = (
  status: Stripe.Subscription.Status,
  membership: MembershipStatus
): MembershipStatus => {
  switch (status) {
    case "active":
    case "trialing":
      return membership
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      return "free"
    default:
      return "free"
  }
}

const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"]
  })
}

export const updateStripeCustomer = async (
  userId: string,
  subscriptionId: string,
  customerId: string
) => {
  try {
    if (!userId || !subscriptionId || !customerId) {
      throw new Error("Missing required parameters for updateStripeCustomer")
    }

    const subscription = await getSubscription(subscriptionId)

    const result = await updateProfileAction(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id
    })

    if (!result.isSuccess) {
      throw new Error("Failed to update customer profile")
    }

    return result.data
  } catch (error) {
    console.error("Error in updateStripeCustomer:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update Stripe customer")
  }
}

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<MembershipStatus> => {
  try {
    if (!subscriptionId || !customerId || !productId) {
      throw new Error(
        "Missing required parameters for manageSubscriptionStatusChange"
      )
    }

    const subscription = await getSubscription(subscriptionId)
    const product = await stripe.products.retrieve(productId)
    const membership = product.metadata.membership as MembershipStatus

    if (!["free", "pro"].includes(membership)) {
      throw new Error(
        `Invalid membership type in product metadata: ${membership}`
      )
    }

    const membershipStatus = getMembershipStatus(
      subscription.status,
      membership
    )

    const updateResult = await updateProfileByStripeCustomerIdAction(
      customerId,
      { stripeSubscriptionId: subscription.id, membership: membershipStatus }
    )

    if (!updateResult.isSuccess) {
      throw new Error("Failed to update subscription status")
    }

    return membershipStatus
  } catch (error) {
    console.error("Error in manageSubscriptionStatusChange:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update subscription status")
  }
}


File: /Users/dev/Desktop/project/qcare-mvp/lib/stripe.ts
/*
Contains the Stripe configuration for the app.
*/

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  appInfo: { name: "Receipt AI", version: "0.1.0" }
})

File: /Users/dev/Desktop/project/qcare-mvp/lib/utils.ts
/*
Contains the utility functions for the app.
*/

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


File: /Users/dev/Desktop/project/qcare-mvp/lib/supabase-client.ts
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


File: /Users/dev/Desktop/project/qcare-mvp/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QCare",
  description: "A real-time queue management system.",
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <TailwindIndicator />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/app/globals.css
/*
Global styles for the app.
*/

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}


File: /Users/dev/Desktop/project/qcare-mvp/db/db.ts
/**
 * @file db.ts
 *
 * @description
 *  Centralised Drizzle ORM client initialisation for Postgres, including a
 *  schema map so Drizzle can infer strongly‑typed query helpers.
 *
 *  ❗️Migrations are **not** generated here—follow the user instructions
 *  below to run `drizzle-kit`.
 */

import {
  clinicsTable,
  clinicSettingsTable,
  consultHistoryTable,
  profilesTable,
  queueItemsTable
} from "@/db/schema"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

config({ path: ".env.local" })

/**
 * The schema object must include every pgTable we intend to query through
 * `db.query.<table>` helpers.  Add new tables here whenever you create a
 * new schema file.
 */
const schema = {
  profiles: profilesTable,
  clinics: clinicsTable,
  queueItems: queueItemsTable,
  consultHistory: consultHistoryTable,
  clinicSettings: clinicSettingsTable
} as const

/**
 * Postgres connection using the DATABASE_URL environment variable.
 * `postgres()` returns a lazy client that opens the connection pool on
 * first query.
 */
const client = postgres(process.env.DATABASE_URL!, {
  idle_timeout: 60 // seconds – keep idle connections short for serverless
})

/**
 * Drizzle ORM instance—exported for use in server actions.
 */
export const db = drizzle(client, { schema })


File: /Users/dev/Desktop/project/qcare-mvp/components/landing/hero.tsx
/**
 * @file hero.tsx
 * @description This client component provides the hero section for the landing page.
 * It has been updated to remove dependencies on the 'magicui' components.
 */
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Rocket } from "lucide-react"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Link
          href="https://github.com/mckaywrigley/o1-pro-template-system"
          className="bg-muted mb-4 inline-block rounded-full px-4 py-1.5 text-sm"
        >
          View the code on GitHub
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-8 flex max-w-2xl flex-col items-center justify-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-balance text-6xl font-bold"
        >
          QCare
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="max-w-xl text-balance text-xl"
        >
          A real-time, WhatsApp-driven queue-tracking system.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <Link href="/signup">
            <Button className="bg-blue-500 text-lg hover:bg-blue-600">
              <Rocket className="mr-2 size-5" />
              Get Started →
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="bg-muted mx-auto mt-20 w-full max-w-screen-lg items-center justify-center rounded-lg border shadow-lg"
      >
        <img
          src="/hero.png"
          alt="Hero"
          className="w-full rounded-md border shadow-lg"
        />
      </motion.div>
    </div>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/components/landing/footer.tsx
/*
This server component provides the footer for the app.
*/

import { Github, Twitter } from "lucide-react"
import Link from "next/link"

export async function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Company</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Blog
              </Link>
              <Link
                href="/careers"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Careers
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Product</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/features"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Documentation
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/support"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Support
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Privacy
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Social</h3>
            <div className="flex gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="text-muted-foreground hover:text-foreground size-6 transition" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="text-muted-foreground hover:text-foreground size-6 transition" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-12 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/components/landing/header.tsx
/*
This client component provides the header for the app.
*/

"use client"

import { Button } from "@/components/ui/button"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Menu, Receipt, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" }
]

const signedInLinks = [{ href: "/dashboard", label: "Dashboard" }]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 transition-colors ${
        isScrolled
          ? "bg-background/80 shadow-sm backdrop-blur-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between p-4">
        <motion.div
          className="flex items-center space-x-2 hover:cursor-pointer hover:opacity-80"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Receipt className="size-6" />
          <Link href="/" className="text-xl font-bold">
            Receipt AI
          </Link>
        </motion.div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 space-x-2 md:flex">
          {navLinks.map(link => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={link.href}
                className="text-muted-foreground hover:text-foreground rounded-full px-3 py-1 transition"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          <SignedIn>
            {signedInLinks.map(link => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground rounded-full px-3 py-1 transition"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </SignedIn>
        </nav>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost">Sign In</Button>
              </motion.div>
            </SignInButton>

            <SignUpButton>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button>Get Started</Button>
              </motion.div>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <motion.div
            className="md:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-primary-foreground text-primary p-4 md:hidden"
        >
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block hover:underline"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <SignedIn>
              {signedInLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block hover:underline"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </SignedIn>
          </ul>
        </motion.nav>
      )}
    </motion.header>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/components/magicui/animated-gradient-text.tsx
/*
This client component provides an animated gradient text.
*/

import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export default function AnimatedGradientText({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40",
        className
      )}
    >
      <div
        className={`animate-gradient absolute inset-0 block size-full bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] [border-radius:inherit] ![mask-composite:subtract] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
      />

      {children}
    </div>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/components/magicui/hero-video-dialog.tsx
/*
This client component provides a video dialog for the hero section.
*/

"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Play, XIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 }
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 }
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  }
}

export default function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const selectedAnimation = animationVariants[animationStyle]

  return (
    <div className={cn("relative", className)}>
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div
              className={`from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
            >
              <Play
                className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            >
              <motion.button className="absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black">
                <XIcon className="size-5" />
              </motion.button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
                <iframe
                  src={videoSrc}
                  className="size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/lib/hooks/use-mobile.tsx
/*
Hook to check if the user is on a mobile device.
*/

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}


File: /Users/dev/Desktop/project/qcare-mvp/lib/hooks/use-copy-to-clipboard.tsx
/*
Hook for copying text to the clipboard.
*/

"use client"

import { useState } from "react"

export interface useCopyToClipboardProps {
  timeout?: number
}

export function useCopyToClipboard({
  timeout = 2000
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState<Boolean>(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return
    }

    if (!value) {
      return
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { isCopied, copyToClipboard }
}


File: /Users/dev/Desktop/project/qcare-mvp/lib/hooks/use-toast.ts
/*
Hook to display toast notifications.
*/

"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId: toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        )
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId)
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: open => {
        if (!open) dismiss()
      }
    }
  })

  return { id: id, dismiss, update }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId })
  }
}

export { toast, useToast }


File: /Users/dev/Desktop/project/qcare-mvp/actions/db/queue_items_actions.ts
/**
 * @file queue-items-actions.ts
 *
 * @description
 * Server actions for managing the `queue_items` table. This includes operations
 * such as creating, reordering, and updating the status of queue items. These
 * actions encapsulate the database logic and are designed to be securely called
 * from client components.
 *
 * @see
 * - Drizzle ORM (`drizzle-orm`) for database queries.
 * - `db/schema/queue-items-schema.ts` for table and type definitions.
 * - `types/server-action-types.ts` for the `ActionState` return type.
 */
"use server"

import { db } from "@/db/db"
import {
  consultHistoryTable,
  InsertQueueItem,
  queueItemsTable,
  queueStatusEnum,
  SelectQueueItem
} from "@/db/schema"
import { ActionState } from "@/types"
import { and, asc, desc, eq, gte, sql } from "drizzle-orm"
import { startOfDay } from "date-fns"
import { revalidatePath } from "next/cache"
import { createConsultHistoryAction } from "./consult_history_actions"

/**
 * The input type for creating a new queue item, omitting fields that are
 * managed by the server (e.g., id, status, position).
 */
type CreateQueueItemInput = Omit<
  InsertQueueItem,
  "id" | "status" | "position" | "createdAt" | "updatedAt"
>

/**
 * The input type for reordering items, specifying the unique identifier
 * and the new desired position for each item.
 */
interface ReorderQueueItem {
  id: string
  position: number
}

// =================================================================================
// C R E A T E
// =================================================================================

export async function createQueueItemAction(
  data: CreateQueueItemInput
): Promise<ActionState<SelectQueueItem>> {
  try {
    const newQueueItem = await db.transaction(async tx => {
      const [lastQueueItem] = await tx
        .select({ position: queueItemsTable.position })
        .from(queueItemsTable)
        .where(
          and(
            eq(queueItemsTable.clinicId, data.clinicId),
            eq(queueItemsTable.status, "WAITLIST")
          )
        )
        .orderBy(desc(queueItemsTable.position))
        .limit(1)

      const newPosition = lastQueueItem ? lastQueueItem.position + 1 : 0

      const [insertedItem] = await tx
        .insert(queueItemsTable)
        .values({
          ...data,
          status: "WAITLIST",
          position: newPosition
        })
        .returning()

      return insertedItem
    })

    revalidatePath("/reception")

    return {
      isSuccess: true,
      message: "Patient added to queue successfully.",
      data: newQueueItem
    }
  } catch (error) {
    console.error("Error creating queue item:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return { isSuccess: false, message: "Failed to add patient to the queue." }
  }
}

// =================================================================================
// R E A D
// =================================================================================

/**
 * The shape of the data returned for the public patient-facing queue page.
 */
export interface PublicQueueDetails {
  queueItem: SelectQueueItem
  position: number
  estimatedWaitTimeMinutes: number
}

export async function getPublicQueueItemDetailsAction(
  queueItemId: string
): Promise<ActionState<PublicQueueDetails>> {
  try {
    // 1. Fetch the specific patient's queue item
    const [item] = await db
      .select()
      .from(queueItemsTable)
      .where(eq(queueItemsTable.id, queueItemId))

    if (!item) {
      return { isSuccess: false, message: "Queue entry not found." }
    }

    if (item.status !== "WAITLIST") {
      return {
        isSuccess: false,
        message: `Your consultation status is: ${item.status}.`
      }
    }

    const { clinicId } = item

    // 2. Fetch all patients in the waitlist for that clinic to determine position
    const waitlist = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.clinicId, clinicId),
        eq(queueItemsTable.status, "WAITLIST")
      ),
      orderBy: [asc(queueItemsTable.position)]
    })

    const position = waitlist.findIndex(i => i.id === queueItemId)

    // 3. Calculate estimated wait time based on recent consultations
    const sampleSize = parseInt(process.env.WAIT_ESTIMATE_SAMPLE_SIZE || "5")
    const recentConsults = await db
      .select({ duration: consultHistoryTable.consultDurationSeconds })
      .from(consultHistoryTable)
      .where(eq(consultHistoryTable.clinicId, clinicId))
      .orderBy(desc(consultHistoryTable.createdAt))
      .limit(sampleSize)

    let avgConsultTimeSeconds = 15 * 60 // Default to 15 mins
    if (recentConsults.length > 0) {
      const totalDuration = recentConsults.reduce(
        (sum, consult) => sum + consult.duration,
        0
      )
      avgConsultTimeSeconds = totalDuration / recentConsults.length
    }

    const estimatedWaitTimeMinutes = Math.round(
      (position * avgConsultTimeSeconds) / 60
    )

    return {
      isSuccess: true,
      message: "Queue details retrieved.",
      data: {
        queueItem: item,
        position: position + 1, // Return 1-based index for display
        estimatedWaitTimeMinutes
      }
    }
  } catch (error) {
    console.error("Error getting public queue details:", error)
    return { isSuccess: false, message: "Failed to retrieve queue details." }
  }
}

export async function getQueueItemsByClinicAction(
  clinicId: string
): Promise<ActionState<SelectQueueItem[]>> {
  try {
    const todayStart = startOfDay(new Date())

    const items = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.clinicId, clinicId),
        // gte(queueItemsTable.createdAt, todayStart)
      ),
      orderBy: [asc(queueItemsTable.status), asc(queueItemsTable.position)]
    })

    return {
      isSuccess: true,
      message: "Queue items retrieved successfully.",
      data: items
    }
  } catch (error) {
    console.error("Error retrieving queue items:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return { isSuccess: false, message: "Failed to retrieve queue items." }
  }
}

export async function getQueueItemsByDoctorIdAction(
  clinicId: string,
  doctorId: string
): Promise<ActionState<SelectQueueItem[]>> {
  try {
    const todayStart = startOfDay(new Date())
    const items = await db.query.queueItems.findMany({
      where: and(
        eq(queueItemsTable.clinicId, clinicId),
        eq(queueItemsTable.doctorId, doctorId),
        eq(queueItemsTable.status, "WAITLIST"),
        gte(queueItemsTable.createdAt, todayStart)
      ),
      orderBy: [asc(queueItemsTable.position)]
    })

    return {
      isSuccess: true,
      message: `Queue for Dr. ${doctorId} retrieved successfully.`,
      data: items
    }
  } catch (error) {
    console.error("Error retrieving doctor's queue items:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return { isSuccess: false, message: "Failed to retrieve doctor's queue." }
  }
}

// =================================================================================
// U P D A T E
// =================================================================================

export async function reorderQueueAction(
  items: ReorderQueueItem[]
): Promise<ActionState<void>> {
  try {
    await db.transaction(async tx => {
      const updatePromises = items.map(item =>
        tx
          .update(queueItemsTable)
          .set({ position: item.position })
          .where(eq(queueItemsTable.id, item.id))
      )
      await Promise.all(updatePromises)
    })

    revalidatePath("/reception")

    return {
      isSuccess: true,
      message: "Queue reordered successfully.",
      data: undefined
    }
  } catch (error) {
    console.error("Error reordering queue:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return { isSuccess: false, message: "Failed to reorder the queue." }
  }
}

export async function updateQueueStatusAction(
  queueItemId: string,
  newStatus: (typeof queueStatusEnum.enumValues)[number]
): Promise<ActionState<SelectQueueItem>> {
  try {
    const updatedItem = await db.transaction(async tx => {
      const [currentItem] = await tx
        .select()
        .from(queueItemsTable)
        .where(eq(queueItemsTable.id, queueItemId))

      if (!currentItem) {
        throw new Error("Queue item not found.")
      }

      if (newStatus === "COMPLETE" && currentItem.status === "SERVING") {
        const completionTime = new Date()
        const consultStartTime = currentItem.updatedAt
        const registrationTime = currentItem.createdAt

        const waitDurationSeconds = Math.round(
          (consultStartTime.getTime() - registrationTime.getTime()) / 1000
        )
        const consultDurationSeconds = Math.round(
          (completionTime.getTime() - consultStartTime.getTime()) / 1000
        )

        const historyResult = await createConsultHistoryAction({
          data: {
            queueItemId: currentItem.id,
            clinicId: currentItem.clinicId,
            waitDurationSeconds,
            consultDurationSeconds
          },
          tx
        })

        if (!historyResult.isSuccess) {
          throw new Error(
            `Failed to log consultation history: ${historyResult.message}`
          )
        }
      }

      const newPosition =
        newStatus === "COMPLETE" || newStatus === "CANCELLED"
          ? -1
          : currentItem.position

      const [updated] = await tx
        .update(queueItemsTable)
        .set({ status: newStatus, position: newPosition })
        .where(eq(queueItemsTable.id, queueItemId))
        .returning()

      return updated
    })

    if (!updatedItem) {
      return { isSuccess: false, message: "Could not update queue item." }
    }

    revalidatePath("/reception")
    revalidatePath("/doctor")

    return {
      isSuccess: true,
      message: `Status updated successfully to ${newStatus}.`,
      data: updatedItem
    }
  } catch (error) {
    console.error("Error updating queue status:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return {
      isSuccess: false,
      message: "An unknown error occurred while updating status."
    }
  }
}

File: /Users/dev/Desktop/project/qcare-mvp/actions/db/analytics-actions.ts
/**
 * @file analytics-actions.ts
 *
 * @description
 * This file contains server actions dedicated to fetching and processing
 * analytics data from the `consult_history` table. These actions are designed
 * to be called from the Admin Dashboard.
 */
"use server"

import { db } from "@/db/db"
import { consultHistoryTable, SelectConsultHistory } from "@/db/schema"
import { ActionState } from "@/types"
import { and, avg, desc, eq, gte } from "drizzle-orm"
import { startOfDay, subDays } from "date-fns"
import stringify from "csv-stringify" // Corrected: Use default import

interface AverageTimes {
  avgWaitSeconds: number
  avgConsultSeconds: number
}

export async function getDailyAverageWaitTimesAction(
  clinicId: string
): Promise<ActionState<AverageTimes>> {
  try {
    const todayStart = startOfDay(new Date())

    const [result] = await db
      .select({
        avgWait: avg(consultHistoryTable.waitDurationSeconds),
        avgConsult: avg(consultHistoryTable.consultDurationSeconds)
      })
      .from(consultHistoryTable)
      .where(
        and(
          eq(consultHistoryTable.clinicId, clinicId),
          gte(consultHistoryTable.createdAt, todayStart)
        )
      )

    return {
      isSuccess: true,
      message: "Daily average times retrieved successfully.",
      data: {
        avgWaitSeconds: result.avgWait
          ? Math.round(parseFloat(result.avgWait))
          : 0,
        avgConsultSeconds: result.avgConsult
          ? Math.round(parseFloat(result.avgConsult))
          : 0
      }
    }
  } catch (error) {
    console.error("Error getting daily average wait times:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve daily average wait times."
    }
  }
}

export async function getConsultHistoryForExportAction(
  clinicId: string
): Promise<ActionState<SelectConsultHistory[]>> {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30)

    const history = await db.query.consultHistory.findMany({
      where: and(
        eq(consultHistoryTable.clinicId, clinicId),
        gte(consultHistoryTable.createdAt, thirtyDaysAgo)
      ),
      orderBy: [desc(consultHistoryTable.createdAt)]
    })

    return {
      isSuccess: true,
      message: "Consultation history for export retrieved successfully.",
      data: history
    }
  } catch (error) {
    console.error("Error getting consultation history for export:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve consultation history for export."
    }
  }
}

/**
 * @function exportConsultHistoryAction
 * @description Fetches consultation history and converts it to a CSV string.
 * This version uses the asynchronous, callback-based API of csv-stringify
 * wrapped in a Promise to ensure compatibility with modern bundlers.
 *
 * @param {string} clinicId - The UUID of the clinic.
 * @returns {Promise<ActionState<{ csv: string }>>} The generated CSV content as a string.
 */
export async function exportConsultHistoryAction(
  clinicId: string
): Promise<ActionState<{ csv: string }>> {
  const historyResult = await getConsultHistoryForExportAction(clinicId)

  if (!historyResult.isSuccess) {
    return historyResult
  }

  if (historyResult.data.length === 0) {
    return { isSuccess: false, message: "No history to export." }
  }

  try {
    const csvString = await new Promise<string>((resolve, reject) => {
      stringify(
        historyResult.data,
        { header: true },
        (err, stringified) => {
          if (err) {
            return reject(err)
          }
          if (stringified) {
            return resolve(stringified)
          }
          return reject(new Error("CSV stringification resulted in undefined value."))
        }
      )
    })

    return {
      isSuccess: true,
      message: "CSV content generated successfully.",
      data: { csv: csvString }
    }
  } catch (error) {
    console.error("Error generating CSV string:", error)
    return { isSuccess: false, message: "Failed to generate CSV." }
  }
}


File: /Users/dev/Desktop/project/qcare-mvp/actions/db/consult_history_actions.ts
/**
 * @file consult-history-actions.ts
 *
 * @description
 * Server actions for managing the `consult_history` table. This includes
 * creating, and in the future, reading or deleting consultation history records.
 *
 * @see
 * - `db/schema/consult-history-schema.ts` for table and type definitions.
 */
"use server"

import { db } from "@/db/db"
import {
  consultHistoryTable,
  InsertConsultHistory,
  SelectConsultHistory
} from "@/db/schema"
import { ActionState } from "@/types"

/**
 * Defines a union type that can accept either the main Drizzle `db` client or
 * the client from within a `db.transaction(async (tx) => {})` block.
 * This allows the action to be composable and used within other transactions.
 */
type DbOrTxClient =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0]

// The input interface now uses the flexible DbOrTxClient type.
interface CreateHistoryInput {
  data: InsertConsultHistory
  tx?: DbOrTxClient
}

/**
 * @function createConsultHistoryAction
 * @description Creates a new record in the `consult_history` table. Can be
 * used within a larger database transaction by passing the transaction client.
 *
 * @param {CreateHistoryInput} { data, tx } - An object containing the data and
 * an optional Drizzle transaction client.
 *
 * @returns {Promise<ActionState<SelectConsultHistory>>} An `ActionState` object
 * containing the result of the operation.
 */
export async function createConsultHistoryAction({
  data,
  tx
}: CreateHistoryInput): Promise<ActionState<SelectConsultHistory>> {
  try {
    // Use the transaction client if it's passed, otherwise use the global db client.
    const dbClient = tx || db

    const [newHistory] = await dbClient
      .insert(consultHistoryTable)
      .values(data)
      .returning()

    return {
      isSuccess: true,
      message: "Consultation history created successfully.",
      data: newHistory
    }
  } catch (error) {
    console.error("Error creating consult history:", error)
    if (error instanceof Error) {
      return { isSuccess: false, message: error.message }
    }
    return {
      isSuccess: false,
      message: "Failed to create consultation history."
    }
  }
}

File: /Users/dev/Desktop/project/qcare-mvp/actions/db/profiles-actions.ts
/*
Contains server actions related to profiles in the DB.
*/

"use server"

import { db } from "@/db/db"
import {
  InsertProfile,
  profilesTable,
  SelectProfile
} from "@/db/schema/profiles-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createProfileAction(
  data: InsertProfile
): Promise<ActionState<SelectProfile>> {
  try {
    const [newProfile] = await db.insert(profilesTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Profile created successfully",
      data: newProfile
    }
  } catch (error) {
    console.error("Error creating profile:", error)
    return { isSuccess: false, message: "Failed to create profile" }
  }
}

export async function getProfileByUserIdAction(
  userId: string
): Promise<ActionState<SelectProfile>> {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId)
    })
    if (!profile) {
      return { isSuccess: false, message: "Profile not found" }
    }

    return {
      isSuccess: true,
      message: "Profile retrieved successfully",
      data: profile
    }
  } catch (error) {
    console.error("Error getting profile by user id", error)
    return { isSuccess: false, message: "Failed to get profile" }
  }
}

export async function updateProfileAction(
  userId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning()

    if (!updatedProfile) {
      return { isSuccess: false, message: "Profile not found to update" }
    }

    return {
      isSuccess: true,
      message: "Profile updated successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { isSuccess: false, message: "Failed to update profile" }
  }
}

export async function updateProfileByStripeCustomerIdAction(
  stripeCustomerId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
      .returning()

    if (!updatedProfile) {
      return {
        isSuccess: false,
        message: "Profile not found by Stripe customer ID"
      }
    }

    return {
      isSuccess: true,
      message: "Profile updated by Stripe customer ID successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile by stripe customer ID:", error)
    return {
      isSuccess: false,
      message: "Failed to update profile by Stripe customer ID"
    }
  }
}

export async function deleteProfileAction(
  userId: string
): Promise<ActionState<void>> {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId))
    return {
      isSuccess: true,
      message: "Profile deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return { isSuccess: false, message: "Failed to delete profile" }
  }
}


File: /Users/dev/Desktop/project/qcare-mvp/app/(auth)/layout.tsx
/*
This server layout provides a centered layout for (auth) pages.
*/

"use server"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center">{children}</div>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/components/utilities/tailwind-indicator.tsx
/*
This server component provides a tailwind indicator for the app in dev mode.
*/

"use server"

export async function TailwindIndicator() {
  // Don't show in production
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-12 left-3 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/components/utilities/theme-switcher.tsx
/*
This client component provides a theme switcher for the app.
*/

"use client"

import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { HTMLAttributes, ReactNode } from "react"

interface ThemeSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const ThemeSwitcher = ({ children, ...props }: ThemeSwitcherProps) => {
  const { setTheme, theme } = useTheme()

  const handleChange = (theme: "dark" | "light") => {
    localStorage.setItem("theme", theme)
    setTheme(theme)
  }

  return (
    <div
      className={cn(
        "p-1 hover:cursor-pointer hover:opacity-50",
        props.className
      )}
      onClick={() => handleChange(theme === "light" ? "dark" : "light")}
    >
      {theme === "dark" ? (
        <Moon className="size-6" />
      ) : (
        <Sun className="size-6" />
      )}
    </div>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/components/utilities/providers.tsx
/*
This client component provides the providers for the app.
*/

"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps
} from "next-themes"

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/db/schema/clinic-settings-schema.ts
/**
 * @file clinic-settings-schema.ts
 *
 * @description
 *  Drizzle ORM table definition for **`clinic_settings`**.
 *  Holds user‑configurable behaviour such as WhatsApp alert thresholds.
 *
 * @columns
 *  - clinicId (FK)          : The owning clinic (unique)
 *  - alertThreshold         : Integer (# patients away to trigger alert)
 *  - defaultLanguage        : Text (e.g., 'en' | 'hi')
 *  - whatsappTemplateId     : Twilio template reference
 *  - createdAt / updatedAt  : Audit
 *
 * @rules
 *  - Exactly **one row per clinic** enforced via a unique constraint.
 */

import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  unique
} from "drizzle-orm/pg-core"

import { clinicsTable } from "./clinics-schema"

export const clinicSettingsTable = pgTable(
  "clinic_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    clinicId: uuid("clinic_id")
      .references(() => clinicsTable.id, { onDelete: "cascade" })
      .notNull(),

    alertThreshold: integer("alert_threshold").notNull().default(3),

    defaultLanguage: text("default_language").notNull().default("en"),

    whatsappTemplateId: text("whatsapp_template_id"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  /**
   * Table‑level configurations (constraints, indexes).
   * `unique(clinicId)` makes sure each clinic has at most one settings row.
   */
  table => ({
    clinicUnique: unique("clinic_settings_clinic_id_unique").on(table.clinicId)
  })
)

export type InsertClinicSettings = typeof clinicSettingsTable.$inferInsert
export type SelectClinicSettings = typeof clinicSettingsTable.$inferSelect


File: /Users/dev/Desktop/project/qcare-mvp/db/schema/queue-items-schema.ts
/**
 * @file queue-items-schema.ts
 *
 * @description
 *  Drizzle ORM table definition for **`queue_items`**. Each row represents
 *  a patient currently (or previously) in an OPD queue.
 *
 *  The table supports real‑time updates via Supabase Realtime, so we set
 *  `replica identity full` in Step 1.2 SQL instructions.
 *
 * @columns
 *  - id, clinicId              : Identification & tenancy
 *  - patientName, phone        : Patient contact details
 *  - reason                    : Reason for visit / chief complaint
 *  - status (enum)             : WAITLIST | SERVING | COMPLETE | CANCELLED
 *  - position                  : Integer ordering within WAITLIST
 *  - doctorId                  : Optional textual identifier for doctor
 *  - createdAt / updatedAt     : Audit timestamps
 *
 * @relations
 *  - FK clinicId ➔ clinics.id   (ON DELETE CASCADE)
 *
 * @business‑rules
 *  - `position` is only meaningful when `status = WAITLIST`.
 *  - `phone` is optional because some walk‑ins may not provide a number.
 */

import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core"

import { clinicsTable } from "./clinics-schema"

/** Status enumeration as per functional spec */
export const queueStatusEnum = pgEnum("queue_status", [
  "WAITLIST",
  "SERVING",
  "COMPLETE",
  "CANCELLED"
])

export const queueItemsTable = pgTable("queue_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  /** Tenant reference — cascades on clinic deletion */
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Patient‑facing fields */
  patientName: text("patient_name").notNull(),
  phone: text("phone"), // Optional

  /** Chief complaint / reason for visit */
  reason: text("reason"),

  /** Current queue status; default is WAITLIST */
  status: queueStatusEnum("status").notNull().default("WAITLIST"),

  /**
   * Display ordering inside WAITLIST.
   * IMPORTANT: Managed exclusively by server actions that enforce a dense
   * ranking (0‑n without gaps) to simplify “position” math.
   */
  position: integer("position").notNull().default(0),

  /**
   * The doctor the patient is eventually assigned to.
   * We store the Clerk/Supabase userId or any identifier string.
   */
  doctorId: text("doctor_id"),

  /** Audit fields */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/** Insert type for `queueItemsTable` */
export type InsertQueueItem = typeof queueItemsTable.$inferInsert
/** Select type for `queueItemsTable` */
export type SelectQueueItem = typeof queueItemsTable.$inferSelect


File: /Users/dev/Desktop/project/qcare-mvp/db/schema/consult-history-schema.ts
/**
 * @file consult-history-schema.ts
 *
 * @description
 *  Drizzle ORM table definition for **`consult_history`**.
 *  Each row captures timing metrics once a consultation finishes,
 *  enabling analytics without scanning the volatile `queue_items`.
 *
 * @columns
 *  - queueItemId : FK to the source queue item (CASCADE on delete)
 *  - clinicId    : Tenant, duplicative for faster analytics queries
 *  - waitDurationSeconds
 *  - consultDurationSeconds
 *  - createdAt / updatedAt : Audit
 *
 * @notes
 *  - We duplicate `clinicId` for composite indexing and because
 *    `queue_items` may be removed after 30 days retention.
 */

import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"

import { clinicsTable } from "./clinics-schema"
import { queueItemsTable } from "./queue-items-schema"

export const consultHistoryTable = pgTable("consult_history", {
  id: uuid("id").defaultRandom().primaryKey(),

  /** Original queue item for traceability */
  queueItemId: uuid("queue_item_id")
    .references(() => queueItemsTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Tenant reference (duplicated for faster aggregation) */
  clinicId: uuid("clinic_id")
    .references(() => clinicsTable.id, { onDelete: "cascade" })
    .notNull(),

  /** Time between registration and consult start, in seconds */
  waitDurationSeconds: integer("wait_duration_seconds").notNull(),

  /** Time between consult start and completion, in seconds */
  consultDurationSeconds: integer("consult_duration_seconds").notNull(),

  /** Audit timestamps */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertConsultHistory = typeof consultHistoryTable.$inferInsert
export type SelectConsultHistory = typeof consultHistoryTable.$inferSelect


File: /Users/dev/Desktop/project/qcare-mvp/db/schema/profiles-schema.ts
/*
Defines the database schema for profiles.
*/

import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const membershipEnum = pgEnum("membership", ["free", "pro"])

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  membership: membershipEnum("membership").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect


File: /Users/dev/Desktop/project/qcare-mvp/db/schema/index.ts
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


File: /Users/dev/Desktop/project/qcare-mvp/db/schema/clinics-schema.ts
/**
 * @file clinics-schema.ts
 *
 * @description
 *  Drizzle ORM table definition for **`clinics`**—the top‑level tenant
 *  entity that owns queue items, settings, and analytics.
 *
 *  Every other domain table contains a `clinicId` FK that cascades on delete,
 *  allowing a single statement to purge all clinic‑scoped data if a clinic is
 *  removed from the platform.
 *
 * @columns
 *  - id          : Primary UUID identifier (generated server‑side)
 *  - name        : Human‑readable clinic name (required)
 *  - createdAt   : Record creation timestamp (default = now)
 *  - updatedAt   : Record update timestamp (auto‑updated on mutation)
 *
 * @notes
 *  - We **always** include an `updatedAt` column (project rule) even when
 *    it is not explicitly mentioned in the spec.
 *  - Indexing `name` is optional at this stage; query volume for clinic
 *    listing is expected to be low. We will add indexes when analytics
 *    warrants it.
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const clinicsTable = pgTable("clinics", {
  /** Primary key — generated UUID */
  id: uuid("id").defaultRandom().primaryKey(),

  /** Display name of the clinic */
  name: text("name").notNull(),

  /** Record creation timestamp */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Record last‑update timestamp
   * Automatically updates on every mutation via `$onUpdate`.
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/** Insert type for `clinicsTable` (used when creating a new clinic) */
export type InsertClinic = typeof clinicsTable.$inferInsert

/** Select type for `clinicsTable` (used when reading a clinic) */
export type SelectClinic = typeof clinicsTable.$inferSelect


File: /Users/dev/Desktop/project/qcare-mvp/app/q/[queueId]/page.tsx
/**
 * @file app/q/[queueId]/page.tsx
 *
 * @description
 * This file defines the server page for viewing a single patient's
 * queue status. It fetches data based on the `queueId` provided in the URL.
 */
"use server"

import { Suspense } from "react"
import PatientQueueView from "./_components/patient-queue-view"
import { getPublicQueueItemDetailsAction } from "@/actions/db/queue_items_actions"

interface PatientQueuePageProps {
  params: {
    queueId: string
  }
}

/**
 * The primary server component for the dynamic `/q/[queueId]` route. It awaits
 * the params and then uses a Suspense boundary to handle loading states.
 */
export default async function PatientQueuePage({
  params
}: PatientQueuePageProps) {
  // Await the params promise to get the resolved value
  const { queueId } = await params

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading your queue status...
        </div>
      }
    >
      <PatientQueueFetcher queueId={queueId} />
    </Suspense>
  )
}

/**
 * An asynchronous server component responsible for fetching the specific patient's
 * queue data and passing it to the display component.
 */
async function PatientQueueFetcher({ queueId }: { queueId: string }) {
  const result = await getPublicQueueItemDetailsAction(queueId)

  if (!result.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center font-semibold text-red-500">
        Error: {result.message}
      </div>
    )
  }

  return <PatientQueueView initialData={result.data} />
}


File: /Users/dev/Desktop/project/qcare-mvp/app/api/stripe/webhooks/route.ts
/*
This API route handles Stripe webhook events to manage subscription status changes and updates user profiles accordingly.
*/

import {
  manageSubscriptionStatusChange,
  updateStripeCustomer
} from "@/actions/stripe-actions"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) {
      throw new Error("Webhook secret or signature missing")
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          await handleCheckoutSession(event)
          break

        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("Webhook handler failed:", error)
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        { status: 400 }
      )
    }
  }

  return new Response(JSON.stringify({ received: true }))
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const productId = subscription.items.data[0].price.product as string
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    })

    const productId = subscription.items.data[0].price.product as string
    await manageSubscriptionStatusChange(
      subscription.id,
      subscription.customer as string,
      productId
    )
  }
}


File: /Users/dev/Desktop/project/qcare-mvp/app/(auth)/signup/[[...signup]]/page.tsx
/*
This client page provides the signup form from Clerk.
*/

"use client"

import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export default function SignUpPage() {
  const { theme } = useTheme()

  return (
    <SignUp
      forceRedirectUrl="/"
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    />
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/app/(auth)/login/[[...login]]/page.tsx
/*
This client page provides the login form from Clerk.
*/

"use client"

import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const { theme } = useTheme()

  return (
    <SignIn
      forceRedirectUrl="/"
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    />
  )
}


File: /Users/dev/Desktop/project/qcare-mvp/app/q/[queueId]/_components/patient-queue-view.tsx
/**
 * @file patient-queue-view.tsx
 * @description This client component displays the patient's current position in the
 * queue and the estimated wait time. It now uses Supabase Realtime to listen
 * for changes and automatically refresh its data.
 *
 * @props
 * - `initialData`: The initial queue details, including the queue item ID.
 */
"use client"

import { PublicQueueDetails } from "@/actions/db/queue_items_actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import { RealtimeChannel } from "@supabase/supabase-js"
import { Clock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface PatientQueueViewProps {
  initialData: PublicQueueDetails
}

export default function PatientQueueView({
  initialData
}: PatientQueueViewProps) {
  const { position, estimatedWaitTimeMinutes } = initialData
  const queueId = initialData.queueItem.id
  const router = useRouter()

  useEffect(() => {
    // This channel listens for ANY change on the `queue_items` table.
    // When a change occurs, we refresh data to get the latest position and wait time.
    const channel: RealtimeChannel = supabase
      .channel(`patient-view-${queueId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue_items" },
        payload => {
          console.log("Change received!", payload)
          // A simple and robust way to get the latest calculated data
          // is to have the server re-render and re-fetch.
          router.refresh()
        }
      )
      .subscribe()

    // Unsubscribe when the component is unmounted
    return () => {
      supabase.removeChannel(channel)
    }
  }, [queueId, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Welcome, {initialData.queueItem.patientName}!
          </CardTitle>
          <CardDescription>
            Here is your current status in the queue. This page will update
            automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6 p-6 text-center">
          <div className="flex flex-col items-center rounded-lg bg-blue-50 p-4">
            <User className="mb-2 size-8 text-blue-500" />
            <p className="text-muted-foreground text-sm">You are number</p>
            <p className="text-4xl font-bold text-blue-600">{position}</p>
            <p className="text-muted-foreground text-sm">in line</p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-green-50 p-4">
            <Clock className="mb-2 size-8 text-green-500" />
            <p className="text-muted-foreground text-sm">Estimated wait is</p>
            <p className="text-4xl font-bold text-green-600">
              {estimatedWaitTimeMinutes}
            </p>
            <p className="text-muted-foreground text-sm">minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

</file_contents>


</existing_code>

Your task is to:
1. Identify the next incomplete step from the implementation plan (marked with `- [ ]`)
2. Generate the necessary code for all files specified in that step
3. Return the generated code

The implementation plan is just a suggestion meant to provide a high-level overview of the objective. Use it to guide you, but you do not have to adhere to it strictly. Make sure to follow the given rules as you work along the lines of the plan.

For EVERY file you modify or create, you MUST provide the COMPLETE file contents in the format above.

Each file should be wrapped in a code block with its file path above it and a "Here's what I did and why":

Here's what I did and why: [text here...]
Filepath: src/components/Example.tsx
```
/**
 * @description 
 * This component handles [specific functionality].
 * It is responsible for [specific responsibilities].
 * 
 * Key features:
 * - Feature 1: Description
 * - Feature 2: Description
 * 
 * @dependencies
 * - DependencyA: Used for X
 * - DependencyB: Used for Y
 * 
 * @notes
 * - Important implementation detail 1
 * - Important implementation detail 2
 */

BEGIN WRITING FILE CODE
// Complete implementation with extensive inline comments & documentation...
```

Documentation requirements:
- File-level documentation explaining the purpose and scope
- Component/function-level documentation detailing inputs, outputs, and behavior
- Inline comments explaining complex logic or business rules
- Type documentation for all interfaces and types
- Notes about edge cases and error handling
- Any assumptions or limitations

Guidelines:
- Implement exactly one step at a time
- Ensure all code follows the project rules and technical specification
- Include ALL necessary imports and dependencies
- Write clean, well-documented code with appropriate error handling
- Always provide COMPLETE file contents - never use ellipsis (...) or placeholder comments
- Never skip any sections of any file - provide the entire file every time
- Handle edge cases and add input validation where appropriate
- Follow TypeScript best practices and ensure type safety
- Include necessary tests as specified in the testing strategy

Begin by identifying the next incomplete step from the plan, then generate the required code (with complete file contents and documentation).

Above each file, include a "Here's what I did and why" explanation of what you did for that file.

Then end with "STEP X COMPLETE. Here's what I did and why:" followed by an explanation of what you did and then a "USER INSTRUCTIONS: Please do the following:" followed by manual instructions for the user for things you can't do like installing libraries, updating configurations on services, etc.

You also have permission to update the implementation plan if needed. If you update the implementation plan, include each modified step in full and return them as markdown code blocks at the end of the user instructions. No need to mark the current step as complete - that is implied.