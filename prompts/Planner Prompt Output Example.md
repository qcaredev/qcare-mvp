# Implementation Plan

## 0 – Bootstrap & Configuration
- [ ] **Step 0.1: Install runtime dependencies**
  - **Task**: Add Supabase client, Twilio, Drag‑and‑Drop kit, csv-stringify.
  - **Files**:  
    - `package.json`: add `@supabase/supabase-js`, `twilio`, `@dnd-kit/core`, `csv-stringify`.
  - **Step Dependencies**: none
  - **User Instructions**:  
    ```bash
    npm install @supabase/supabase-js twilio @dnd-kit/core csv-stringify
    ```

- [ ] **Step 0.2: Extend environment variables**
  - **Task**: Update `.env.example` with Supabase/Twilio keys + new settings.
  - **Files**:  
    - `.env.example`: add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `WAIT_ESTIMATE_SAMPLE_SIZE=5`.
  - **Step Dependencies**: 0.1  
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
