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
  - **Task**: Add Supabase client, Twilio, Drag-and-Drop kit, csv-stringify.
  - **Files**:  
    - `package.json`: add `@supabase/supabase-js`, `twilio`, `@dnd-kit/core`, `csv-stringify`.
  - **Step Dependencies**: none
  - **User Instructions**:  
    ```bash
    npm install @supabase/supabase-js twilio @dnd-kit/core csv-stringify
    ```

- [ ] **Step 0.2: Extend environment variables**
  - **Task**: Update `.env.example` with Supabase/Twilio keys + new settings.
  - **Files**:  
    - `.env.example`: add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `WAIT_ESTIMATE_SAMPLE_SIZE=5`.
  - **Step Dependencies**: 0.1  
  - **User Instructions**: Copy values to `.env.local`.

## 1 – Database Schema
- [ ] **Step 1.1: Define enums & tables**
  - **Task**: Create Drizzle schema files for `clinics`, `queue_items`, `consult_history`, `clinic_settings`.
  - **Files**:  
    - `db/schema/clinics-schema.ts`  
    - `db/schema/queue-items-schema.ts`  
    - `db/schema/consult-history-schema.ts`  
    - `db/schema/clinic-settings-schema.ts`  
    - `db/schema/index.ts`: export new tables  
    - `db/db.ts`: add tables to `schema` object
  - **Step Dependencies**: 0.2
  - **User Instructions**: Run `npx drizzle-kit generate && npx drizzle-kit migrate`.

- [ ] **Step 1.2: SQL for RLS & Realtime**
  - **Task**: Provide SQL to enable RLS & realtime on new tables.
  - **Files**: _Documentation only_ (no code files)
  - **Step Dependencies**: 1.1
  - **User Instructions**:  
    ```sql
    -- Enable Realtime
    alter table queue_items replica identity full;
    begin;
      alter publication supabase_realtime add table queue_items;
    commit;

    -- RLS (everyone read; only service role write for now)
    alter table queue_items enable row level security;
    create policy "read queue" on queue_items
      for select using (true);
    ```

## 2 – Server Actions (Database)
- [ ] **Step 2.1: createQueueItemAction**
  - **Task**: Insert patient row, compute `position`, return row.
  - **Files**:  
    - `actions/db/queue-items-actions.ts`: new file with createQueueItemAction.
    - `types/actions-types.ts`: add Queue related types if necessary.
  - **Step Dependencies**: 1.1

- [ ] **Step 2.2: reorderQueueAction**
  - **Task**: Update `position` for an array of ids in a transaction.
  - **Files**:  
    - `actions/db/queue-items-actions.ts`: add function.
  - **Step Dependencies**: 2.1

- [ ] **Step 2.3: updateQueueStatusAction**
  - **Task**: Move item to new status, record wait/consult durations when COMPLETE.
  - **Files**:  
    - `actions/db/queue-items-actions.ts`: extend file.
    - `actions/db/consult-history-actions.ts`: new file for insert.
  - **Step Dependencies**: 2.2

## 3 – Server Actions (Twilio)
- [ ] **Step 3.1: sendWhatsAppMessageAction**
  - **Task**: Wrapper around Twilio REST client. Handles errors & returns ActionState.
  - **Files**:  
    - `actions/twilio-actions.ts`: new file.
  - **Step Dependencies**: 0.2

## 4 – Reception Dashboard
- [ ] **Step 4.1: Route & Server Page**
  - **Task**: Create `app/reception/page.tsx` fetching grouped queue items, passing to Kanban.
  - **Files**:  
    - `app/reception/page.tsx`
  - **Step Dependencies**: 2.3

- [ ] **Step 4.2: Kanban Client Component**
  - **Task**: Implement `_components/queue-kanban.tsx` using `@dnd-kit`. Includes drag, advance, cancel, notify.
  - **Files**:  
    - `app/reception/_components/queue-kanban.tsx`
    - `app/reception/_components/queue-card.tsx`
  - **Step Dependencies**: 4.1

- [ ] **Step 4.3: Queue Mutations Hooks**
  - **Task**: Client helpers that call server actions & optimistic update.
  - **Files**:  
    - `app/reception/_components/use-queue-mutations.ts`
  - **Step Dependencies**: 4.2

## 5 – Doctor Dashboard
- [ ] **Step 5.1: Route & Server Page**
  - **Task**: `app/doctor/page.tsx` lists WAITLIST items filtered by doctorId.
  - **Files**:  
    - `app/doctor/page.tsx`
  - **Step Dependencies**: 2.3

- [ ] **Step 5.2: Mini‑Profile Dialog**
  - **Task**: Client component showing Name | Age | Gender | Complaint etc.
  - **Files**:  
    - `app/doctor/_components/mini-profile-dialog.tsx`
  - **Step Dependencies**: 5.1

## 6 – Patient Public Page
- [ ] **Step 6.1: Route**
  - **Task**: `app/q/[queueId]/page.tsx` – shows live position & wait‑time, auto‑refresh via Supabase Realtime.
  - **Files**:  
    - `app/q/[queueId]/page.tsx`
  - **Step Dependencies**: 1.1

## 7 – Supabase Realtime Integration
- [ ] **Step 7.1: Realtime client util**
  - **Task**: `lib/supabase-client.ts` singleton; subscribe to `queue_items`.
  - **Files**:  
    - `lib/supabase-client.ts`
  - **Step Dependencies**: 0.1

- [ ] **Step 7.2: Hook in dashboards**
  - **Task**: Add useEffect in Kanban & doctor list to update local state on realtime events.
  - **Files**:  
    - `app/reception/_components/queue-kanban.tsx`
    - `app/doctor/_components/next-up-list.tsx` _(new)_
  - **Step Dependencies**: 7.1

## 8 – Admin & Analytics
- [ ] **Step 8.1: Analytics queries**
  - **Task**: `actions/db/analytics-actions.ts` – daily avg wait, CSV export.
  - **Files**:  
    - `actions/db/analytics-actions.ts`
  - **Step Dependencies**: 2.3

- [ ] **Step 8.2: Admin page**
  - **Task**: `app/admin/page.tsx` – charts with recharts, CSV download button.
  - **Files**:  
    - `app/admin/page.tsx`
  - **Step Dependencies**: 8.1

## 9 – Settings Panel
- [ ] **Step 9.1: Clinic settings CRUD**
  - **Task**: Server actions + simple form to update alert threshold & language.
  - **Files**:  
    - `actions/db/clinic-settings-actions.ts`
    - `app/admin/_components/settings-form.tsx`
  - **Step Dependencies**: 1.1, 8.2

## 10 – Auth & Authorization Enhancements
- [ ] **Step 10.1: Role claims helper**
  - **Task**: Add `lib/use-role.ts` (reads Clerk public metadata for role: staff, doctor, admin).
  - **Files**:  
    - `lib/use-role.ts`
  - **Step Dependencies**: none (can run anytime before protected pages)

- [ ] **Step 10.2: Protected route middleware update**
  - **Task**: Extend `middleware.ts` to guard `/reception`, `/doctor`, `/admin` by role.
  - **Files**:  
    - `middleware.ts`
  - **Step Dependencies**: 10.1

## 11 – Notifications Logic
- [ ] **Step 11.1: Automatic “You’re next” trigger**
  - **Task**: In `updateQueueStatusAction` and `reorderQueueAction`, detect position ≤ threshold & call Twilio action.
  - **Files**:  
    - `actions/db/queue-items-actions.ts`
  - **Step Dependencies**: 3.1

## 12 – Unit & e2e Testing
- [ ] **Step 12.1: Jest unit tests for server actions**
  - **Task**: tests for queue actions & Twilio action (mocked).
  - **Files**:  
    - `tests/createQueueItemAction.test.ts`
    - `tests/updateQueueStatusAction.test.ts`
  - **Step Dependencies**: 2.3, 3.1

- [ ] **Step 12.2: Playwright e2e**
  - **Task**: scenarios: Reception flow, Doctor flow, Alert triggered.
  - **Files**:  
    - `playwright.config.ts`
    - `tests/e2e/*`
  - **Step Dependencies**: 4.3, 5.2, 11.1

## 13 – Deployment Notes
- [ ] **Step 13.1: Vercel & Supabase set‑up guide**
  - **Task**: Markdown doc `DEPLOY.md` with env var list, Supabase SQL snippets, Twilio Sandbox config.
  - **Files**:  
    - `DEPLOY.md`
  - **Step Dependencies**: all previous steps

### Summary

The plan proceeds from foundational setup through back‑end schema & actions, then outward to UI features for each user role, real‑time updates, notifications, analytics, testing, and deployment documentation. Each step is atomic (≤ 20 files), ordered to satisfy dependencies, and includes clear instructions for any manual tasks (migration, RLS, environment variables, package installs). This sequence enables a code‑generation system to implement QCare incrementally, validating each layer before proceeding to the next.


</implementation_plan>

</implementation_plan>

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