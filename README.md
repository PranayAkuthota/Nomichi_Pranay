# Nomichi Trip Desk

A CRM and trip management system for Nomichi, a premium slow-travel company. Built with Next.js 15, Supabase, and Tailwind CSS.

---

## What I built

Three connected parts:

1. **Public enquiry page** — Mobile-first, shows open trips with price, dates, description. Enquiry form saves directly to Supabase with full validation.
2. **Admin CRM** — Authenticated area with lead pipeline (NEW → CONTACTED → QUALIFIED → VIBE_CHECK_SENT → CONFIRMED → NOT_A_FIT), search/filter/sort, owner assignment, call log, activity timeline, CSV export.
3. **Trips CMS** — Create, edit, open, close trips from admin. Closed trips disappear from the public page instantly.
4. **Dashboard** — Stat cards, pie chart by status, bar chart by trip, recent activity feed.
5. **AI feature** — Generates a first WhatsApp message per Nomichi's voice (warm, short, no exclamation marks, no em dashes, references what the traveller wrote).

---

## Tech stack

- **Framework**: Next.js 15 App Router, TypeScript
- **Database + Auth**: Supabase (PostgreSQL, RLS)
- **Styling**: Tailwind CSS, shadcn/ui primitives
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Notifications**: Sonner
- **AI**: OpenAI gpt-4o-mini (server-side only)
- **Deployment**: Vercel

---

## Setup

### 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run these files in order:
   - `supabase/schema.sql`
   - `supabase/rpc.sql`
   - `supabase/seed.sql`
3. Go to **Auth > Users** and create three users:
   - `priya@thenomichi.com` (admin)
   - `arjun@thenomichi.com` (associate)
   - `leela@thenomichi.com` (associate)
4. Copy each user's UUID and update the first INSERT in `seed.sql` before running it, replacing the placeholder UUIDs with real ones.
5. Go to **Project Settings > API** and copy your `URL` and `anon` key.

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-...
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Vercel deployment

1. Push the repo to GitHub
2. Import into [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings (same as `.env.local`)
4. Deploy

---

## Admin credentials

After creating users in Supabase Auth:

| Email | Password | Role |
|---|---|---|
| priya@thenomichi.com | (set in Supabase Auth) | Admin |
| arjun@thenomichi.com | (set in Supabase Auth) | Associate |
| leela@thenomichi.com | (set in Supabase Auth) | Associate |

Admin login: `/login`

---

## Decisions I am most proud of

**1. Activity log as a first-class feature.** Every status change, owner assignment, and note is recorded automatically via server actions. The timeline is built from real events, not reconstructed from field diffs. This means the history is accurate and the code stays clean.

**2. The AI WhatsApp generator references what the traveller actually wrote.** It is not a generic template. It pulls `trip_feeling` from the lead and instructs the model to reference a specific detail. This is the difference between a feature that helps and one that adds noise.

**3. RLS is on from day one.** Public can only read open trips and insert leads. All admin operations require an authenticated session. No secret bypass, no service role key in the client.

---

## With another week

- Row-level security so each associate only sees their own leads
- Real-time lead updates using Supabase Realtime
- WhatsApp send integration (Twilio or 360dialog)
- Lead vibe-fit scorer — reads `trip_feeling` and flags whether the traveller looks like a slow-travel fit
- Mobile-optimised admin for on-the-go team use
