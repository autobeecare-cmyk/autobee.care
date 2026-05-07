# AutoBee Landing Page & Survey — Build Prompts

> Two production-ready prompts for Cursor / Claude Code.
> Stack: Next.js 14 (App Router) + TypeScript + Tailwind + Supabase + shadcn/ui

---

## PROJECT SETUP — Run This First (One-Time)

```bash
npx create-next-app@latest autobee-validation --typescript --tailwind --app --src-dir --import-alias "@/*"
cd autobee-validation

npm install @supabase/supabase-js @supabase/ssr
npm install lucide-react framer-motion
npm install zod react-hook-form @hookform/resolvers
npm install sonner

npx shadcn@latest init
npx shadcn@latest add button input label textarea card form select radio-group toast progress separator
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

---

## SUPABASE SCHEMA — Run This in SQL Editor First

```sql
-- ═══════════════════════════════════════════════════
-- AutoBee Validation Database Schema
-- ═══════════════════════════════════════════════════

-- Owner Survey Responses
create table owner_responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,

  -- About You
  name text not null,
  phone text not null,
  email text,
  age_group text,
  area text,
  occupation text,

  -- Vehicle Info
  vehicle_type text,
  vehicle_make_model text,
  vehicle_age text,

  -- Wash Habits
  wash_frequency text,
  current_wash_location text,
  current_spend text,
  biggest_pain_point text,

  -- AutoBee Intent (KEY METRICS)
  used_wash_app_before text,
  would_book_via_app text,
  pay_for_subscription text,
  willingness_to_pay text,
  on_time_guarantee_value text,
  fixed_pricing_preference text,

  -- Vehicle Management
  want_vehicle_management text,
  insurance_reminder_useful text,
  service_history_useful text,
  prepurchase_inspection text,

  -- Final
  refer_to_friends text,
  open_feedback text,
  early_access_interest text,

  -- Meta
  user_agent text,
  referrer text,
  ip_country text
);

-- Partner Survey Responses (different shape)
create table partner_responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  surveyed_by text,

  center_name text not null,
  owner_name text not null,
  phone text,
  area text,
  years_in_business text,

  cars_per_day text,
  bikes_per_day text,
  peak_hours text,
  basic_wash_price text,
  premium_wash_price text,
  add_ons_offered text,
  staff_count text,

  has_signage text,
  on_google_maps text,
  uses_digital_tool text,
  customer_acquisition text,
  retention_method text,
  daily_revenue_range text,
  slow_day_frequency text,

  want_more_customers text,
  open_to_commission text,
  acceptable_commission text,
  need_management_software text,
  raw_materials_source text,
  open_to_partnership text,
  notes text
);

-- Early access waitlist
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  name text not null,
  phone text not null,
  email text,
  area text,
  source text default 'landing_page'
);

-- Enable RLS — but allow inserts from anyone
alter table owner_responses enable row level security;
alter table partner_responses enable row level security;
alter table waitlist enable row level security;

-- Allow public to insert their own responses
create policy "Anyone can submit owner survey"
  on owner_responses for insert
  with check (true);

create policy "Anyone can submit partner survey"
  on partner_responses for insert
  with check (true);

create policy "Anyone can join waitlist"
  on waitlist for insert
  with check (true);

-- Only service role can read (use service key in admin dashboard)
create policy "Service role reads all owner data"
  on owner_responses for select
  using (auth.role() = 'service_role');

create policy "Service role reads all partner data"
  on partner_responses for select
  using (auth.role() = 'service_role');

create policy "Service role reads waitlist"
  on waitlist for select
  using (auth.role() = 'service_role');

-- Helpful indexes
create index on owner_responses (created_at desc);
create index on owner_responses (pay_for_subscription);
create index on owner_responses (would_book_via_app);
create index on partner_responses (created_at desc);
create index on partner_responses (open_to_partnership);
create index on waitlist (created_at desc);
```

---

# ═══════════════════════════════════════════════════
# PROMPT 1 — LANDING PAGE
# ═══════════════════════════════════════════════════

Copy everything below into Cursor / Claude Code as a single message:

```
Build a premium dark-themed landing page for AutoBee — a vehicle care platform launching in Trivandrum, Kerala.

═══ BRAND IDENTITY ═══
- Name: AutoBee (autobee.care)
- Tagline: "Smart car care. We come to you."
- Colors:
  • Black background: #000000
  • Pure black (deeper): #0A0A0A
  • Brand amber accent: #F5B700
  • Pure white: #FFFFFF
  • Cool gray: #6B6B6B
  • Light gray: #C8C8C8
- Typography: Outfit Bold for headlines/wordmark, Instrument Sans for body
  Add to layout.tsx:
  import { Outfit, Instrument_Sans } from 'next/font/google'
  const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['400','600','700','800'] })
  const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', weight: ['400','500','600'] })

═══ LOGO RENDERING ═══
Render "autobee.care" as styled text — NOT an image:
  <span className="font-outfit font-bold">
    <span className="text-white">auto</span>
    <span className="text-[#F5B700]">bee</span>
    <span className="text-white">.care</span>
  </span>

═══ PAGE SECTIONS (in order) ═══

1. NAVIGATION (sticky top, transparent → black on scroll)
   - Left: AutoBee logo (text)
   - Right: "Take the Survey" + "Join Waitlist" (amber CTA button)
   - Mobile: hamburger menu

2. HERO SECTION (full screen, dark)
   - Massive headline (2 lines, Outfit Bold 60-80px):
     "Smart car care."
     "We come to you." (the second line in amber #F5B700)
   - Subtitle in gray: "Book washes, manage vehicles, all in one app. Launching in Trivandrum."
   - Two CTAs side by side:
     • Primary: "Join the Waitlist" (amber bg, black text)
     • Secondary: "Take Our 5-min Survey" (outlined white border)
   - Below CTAs: small text "🐝 Be among the first 100 — get free wash credits"
   - Right side or background: subtle animated wheel/spinning SVG illustration in amber
   - Add a stats bar at bottom of hero:
     "0 → ∞ Vehicles serviced  |  Trivandrum  |  Coming Q3 2026"

3. PROBLEM SECTION
   - Heading: "Car wash in India is broken."
   - 3 cards side by side (dark bg, amber icons):
     • "❌ No fixed time" — "Walk in, wait 45 minutes, hope for the best"
     • "❌ Mystery pricing" — "₹150? ₹400? Depends on the mood"
     • "❌ Inconsistent quality" — "Different result every time"

4. SOLUTION SECTION
   - Heading: "AutoBee fixes all of it."
   - 4 features in 2x2 grid with amber numbered tags (01, 02, 03, 04):
     • 01 — "Book exact time slots — like Uber for car wash"
     • 02 — "Fixed prices shown before you book — no surprises"
     • 03 — "On-time guarantee — ₹50 cashback if late"
     • 04 — "All your vehicle needs in one app — wash, insurance, service"

5. FOR PARTNERS SECTION (split layout)
   - Left: "Are you a wash center owner?"
     • "Get pre-paid customers, manage bookings, run your business better"
     • CTA: "Become a Partner" → opens partner survey
   - Right: amber gradient background with key benefits list

6. WAITLIST SECTION (this is the conversion moment)
   - Big amber bg block
   - Heading: "Be the first to know."
   - Form:
     • Name input
     • Phone input (Indian +91 format)
     • Email input (optional)
     • Area dropdown (Pattom, Kowdiar, Kazhakoottam, Technopark, etc.)
     • Submit button: "Join the Hive 🐝"
   - On submit: POST to /api/waitlist → store in Supabase waitlist table
   - Show success toast with sonner

7. SURVEY CTA SECTION
   - Heading: "Help us build something you'll love"
   - Subtitle: "Take our 5-minute survey. Win a free wash voucher."
   - Big amber button: "Take the Survey →" linking to /survey

8. FOOTER
   - 3 columns:
     • AutoBee logo + tagline + "Trivandrum, Kerala"
     • Links: About, Survey, Become a Partner, Contact
     • Social: Instagram (@autobee.care), WhatsApp, Email (hello@autobee.care)
   - Bottom strip: "© 2026 AutoBee. Built with care in Kerala 🐝"
   - Amber line at very top of footer

═══ TECHNICAL REQUIREMENTS ═══

File structure:
  src/app/page.tsx                — landing page
  src/app/api/waitlist/route.ts   — POST handler
  src/lib/supabase/client.ts      — browser client
  src/lib/supabase/server.ts      — server client
  src/components/Logo.tsx         — reusable logo component
  src/components/sections/        — Hero, Problem, Solution, Partners, Waitlist, Footer

Supabase client setup (src/lib/supabase/client.ts):
  import { createBrowserClient } from '@supabase/ssr'
  export const createClient = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

API route /api/waitlist:
  - Validate with zod (name, phone min 10 digits, area)
  - Insert into 'waitlist' table
  - Return 200 with success or 400 with errors

Animations:
  - Use framer-motion for section fade-ins on scroll
  - Hero wheel: subtle continuous rotation
  - Buttons: scale on hover
  - Smooth scroll between sections

Mobile-first responsive:
  - Hero text scales from 80px desktop → 40px mobile
  - Cards stack vertically on mobile
  - Hamburger menu under 768px

Dark theme everywhere:
  - body bg: black (#000000)
  - cards: #0A0A0A or #111111 with subtle border
  - amber accents only for CTAs, important numbers, the "bee" in wordmark

Form validation:
  - react-hook-form + zod resolver
  - Phone: must start with +91 or 10 digits
  - Name: min 2 chars
  - Show inline errors below inputs

Toast notifications:
  - Use sonner (already installed)
  - Success: amber bg, "You're on the list! We'll text you when we launch."
  - Error: red, with error message

Build it now. Use shadcn/ui components for inputs, buttons, cards. Make it look premium — this is a B2C landing page and first impressions matter.
```

---

# ═══════════════════════════════════════════════════
# PROMPT 2 — SURVEY (Multi-Step Form)
# ═══════════════════════════════════════════════════

Copy everything below into Cursor / Claude Code as a single message:

```
Build a multi-step survey at /survey for AutoBee — a vehicle care platform.

The survey collects market validation data from vehicle owners in Trivandrum. It must feel premium, fast, and rewarding to complete (not like a chore). Mobile-first.

═══ BRAND IDENTITY (same as landing) ═══
- Black bg, Amber #F5B700 accent, white text
- Outfit Bold for headlines, Instrument Sans for body
- Tagline: "Smart car care. We come to you."

Logo rendering (text-based):
  <span className="font-outfit font-bold">
    <span className="text-white">auto</span>
    <span className="text-[#F5B700]">bee</span>
    <span className="text-white">.care</span>
  </span>

═══ SURVEY STRUCTURE ═══

6 steps, with a progress bar at the top showing "Step X of 6" + amber fill.
Each step has 3-5 questions max — no overwhelm.

STEP 1 — About You
  - name (text input, required)
  - phone (text, +91 format, required, min 10 digits)
  - email (optional)
  - age_group (radio: 18-25, 26-35, 36-45, 46-55, 55+)
  - area (select: Pattom, Kowdiar, Kazhakoottam, Technopark, Vellayambalam, Thampanoor, Other)
  - occupation (text, optional)

STEP 2 — Your Vehicle
  - vehicle_type (radio: Car only, Bike only, Both, Multiple cars)
  - vehicle_make_model (text — e.g., "Hyundai Creta")
  - vehicle_age (radio: <1 year, 1-3 yrs, 3-5 yrs, 5-10 yrs, 10+ yrs)

STEP 3 — Your Wash Habits
  - wash_frequency (radio: Daily, 2-3x/week, Weekly, Bi-weekly, Monthly, Rarely)
  - current_wash_location (radio: At home myself, Local wash center, Apartment service, Petrol pump, Mix)
  - current_spend (radio: <₹100, ₹100-200, ₹200-400, ₹400-600, ₹600+)
  - biggest_pain_point (radio: Long waiting time, Inconsistent quality, Price uncertainty, No fixed slots, Distance/travel, No major issues)

STEP 4 — AutoBee Concept (KEY VALIDATION SECTION)
  Show a hero card at top of step explaining AutoBee:
  "📱 Imagine an app where you can:
   • Browse nearby wash centers with fixed prices
   • Book an exact time slot — no waiting
   • Get ₹50 cashback if delayed beyond 10 mins
   • Subscribe monthly for guaranteed weekly washes"

  Then ask:
  - used_wash_app_before (radio: Yes / No)
  - would_book_via_app (radio: Definitely yes, Probably yes, Maybe, Probably no, Definitely no)
  - pay_for_subscription (radio: Yes, Maybe, No)
  - willingness_to_pay (radio: <₹300, ₹300-500, ₹500-800, ₹800+, Wouldn't pay)
  - on_time_guarantee_value (radio: Very valuable, Somewhat valuable, Not important)
  - fixed_pricing_preference (radio: Strongly like, Like, Neutral, Don't care)

STEP 5 — Beyond Wash
  Show context: "AutoBee plans to grow into a full vehicle care platform — not just car wash."
  - want_vehicle_management (radio: Yes — important, Nice to have, Don't need)
  - insurance_reminder_useful (radio: Yes, Maybe, No)
  - service_history_useful (radio: Yes, Maybe, No)
  - prepurchase_inspection (radio: Yes — would pay, Maybe, No need)

STEP 6 — Final Thoughts
  - refer_to_friends (radio: Definitely, Maybe, No)
  - open_feedback (textarea, optional, "Any feedback or features you'd love?")
  - early_access_interest (radio: Yes — early access, Maybe, No)
  - SUBMIT button: "Submit & Win a Free Wash 🐝"

After submit:
  → THANK YOU SCREEN with:
    - Big amber checkmark animation
    - "You're awesome. Thank you!"
    - "We'll WhatsApp the wash voucher winner on the 15th."
    - Two buttons: "Visit AutoBee Home" + "Share with Friends" (copies link to clipboard)

═══ TECHNICAL REQUIREMENTS ═══

File structure:
  src/app/survey/page.tsx                — multi-step form container
  src/app/survey/thank-you/page.tsx      — thank you screen
  src/app/api/survey/owner/route.ts      — POST handler
  src/components/survey/
    StepIndicator.tsx
    Step1About.tsx
    Step2Vehicle.tsx
    Step3Habits.tsx
    Step4Concept.tsx
    Step5Beyond.tsx
    Step6Final.tsx
  src/lib/schema.ts                      — zod schemas for validation
  src/lib/supabase/                      — clients

Form state management:
  - Use react-hook-form with single root form across all steps
  - Save draft to localStorage on every change so users don't lose progress
  - Validate each step before allowing "Next"
  - "Back" button preserves all previous answers

Visual design — each step:
  - Top: progress bar (amber fill, gray track), "Step X of 6", section title
  - Center: form fields, large touch-friendly inputs (min height 56px)
  - Radio groups: render as button-style cards (full width, amber on selected, dark border on unselected) — NOT default radio buttons, those look ugly on mobile
  - Bottom: "Back" (left, ghost style) + "Next →" (right, amber primary)
  - Last step: "Back" + "Submit & Win 🐝"

Radio card example styling:
  Selected: bg-[#F5B700] text-black border-[#F5B700]
  Unselected: bg-[#0A0A0A] text-white border-[#1A1A1A] hover:border-[#F5B700]
  All cards: rounded-xl px-5 py-4 cursor-pointer transition-all

Mobile keyboard:
  - Phone field: type="tel" inputMode="numeric"
  - Email: type="email" inputMode="email"
  - Auto-scroll to next field when select/radio chosen

Animations:
  - Slide left/right between steps (framer-motion AnimatePresence)
  - Stagger fade-in for radio cards on each step
  - Progress bar smoothly animates width on step change

API route /api/survey/owner:
  - Validate full form with zod
  - Insert into 'owner_responses' table in Supabase
  - Capture user_agent and referrer from headers
  - Return success/error JSON

Supabase insert (in API route):
  const { error } = await supabase
    .from('owner_responses')
    .insert([{
      ...validatedData,
      user_agent: req.headers.get('user-agent'),
      referrer: req.headers.get('referer'),
    }])

Error handling:
  - Network failure: show retry toast, keep data in localStorage
  - Validation error: highlight field, show inline error
  - Server error: show "Something went wrong, try again" toast

Performance:
  - Lazy load steps 4-6 since users may quit before reaching them
  - No images on survey pages — pure typography for speed
  - First contentful paint <1s

After successful submission:
  - Clear localStorage draft
  - Redirect to /survey/thank-you with confetti animation (use canvas-confetti package)
  - Track completion in Supabase

DO NOT:
  - Don't make the survey feel like a form — make it feel like a conversation
  - Don't ask all questions on one page
  - Don't use default HTML radios/checkboxes
  - Don't show "required" asterisks — use clean labels and validate on Next

Build it now. Survey completion rate is the metric — every UI decision should optimise for that.
```

---

# ═══════════════════════════════════════════════════
# OPTIONAL — ADMIN DASHBOARD PROMPT
# ═══════════════════════════════════════════════════

After the public site is working, build an admin view to see responses live:

```
Build an admin dashboard at /admin for AutoBee. Password protected (basic auth via env var ADMIN_PASSWORD).

Three sections:

1. WAITLIST TABLE — show all signups, sortable by date, with phone/area
2. OWNER SURVEY DASHBOARD — show:
   - Total responses count (big amber number)
   - % saying yes to subscription (big amber number, calculated)
   - Average willingness to pay (calculated)
   - Bar charts for each key question (use recharts)
   - Recent 10 responses table with name, area, key answers
3. PARTNER SURVEY DASHBOARD — same shape

Use Supabase service role key on server-side only — fetch via /api/admin/owner-stats etc.

Show GO/NO-GO indicator at top:
  >60% yes = green "BUILD THE MVP"
  40-60% = amber "REFINE PRICING"
  <40% = red "RECONSIDER MODEL"

Mobile responsive. Dark theme. Same brand colors.
```

---

# ═══════════════════════════════════════════════════
# DEPLOYMENT
# ═══════════════════════════════════════════════════

```bash
# Push to GitHub
git init && git add . && git commit -m "Initial AutoBee validation site"
git remote add origin <your-github-repo>
git push -u origin main

# Deploy to Vercel
# 1. Go to vercel.com → Import Project
# 2. Add env vars:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
#    SUPABASE_SERVICE_ROLE_KEY
#    ADMIN_PASSWORD
# 3. Deploy → custom domain → autobee.care
```

---

# WHAT TO DO IN ORDER

1. **Tonight** — Set up Supabase project (free tier), run the SQL schema
2. **Tomorrow morning** — Run Project Setup commands, paste Prompt 1, get landing page working locally
3. **Tomorrow afternoon** — Paste Prompt 2, get survey working locally
4. **Tomorrow evening** — Push to GitHub, deploy to Vercel, point autobee.care domain
5. **Day 3 onwards** — Share survey link in WhatsApp groups, watch responses come in

Total build time with Cursor or Claude Code: 4-6 hours of focused work for a working site.

Good luck. Ship it fast.