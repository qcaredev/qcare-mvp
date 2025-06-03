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
- [ ] **Clerk Auth** for authentication & role claims (staff, doctor, admin)  
- [ ] **Razorpay Subscriptions** for self-serve monthly clinic billing (cards, UPI, GST invoices)  
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
- Twilio for WhatsApp; Razorpay for billing keeps flow fully India-native  
- Green-field MVP; no legacy HIS integration  
- Data & analytics retained for 30 days (extendable post-MVP)  
- Future roadmap: ML wait-time prediction, Doctor notes sent to the user (prescription, diagnosis results etc), data-retention policy, multi-tenant SaaS scaling
