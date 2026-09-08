# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

GTF Portal — the B2B travel platform for GTF Holidays LLP / Global Travel Fusion. A Next.js 16 (App Router) + TypeScript site with a public marketing site, an agent-facing portal (browse packages → build quotes → convert to bookings), and an admin back office, backed by Supabase.

## Commands

```bash
npm install
npm run dev     # start dev server
npm run build
npm start        # run production build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

No test runner is configured in this repo. Env vars (see `.env.example`, put real values in `.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`, `NEXT_PUBLIC_SITE_URL`.

## Architecture

**Route groups (`app/`)**
- `(public)` — marketing site: `/about`, `/contact`, `/faq`, `/departures/{region}`.
- `(auth)` — `/login`, `/register`.
- `(agent)/dashboard` — agent portal: browse packages, build/track quotes, manage bookings.
- `(admin)/admin` — admin back office: approve agents, manage bookings and departures.
- `api/` — route handlers grouped by domain: `auth/`, `admin/`, `bookings/`, `quotes/`, `departures/`, plus `callback-requests` and `help-requests`.

**Auth is hand-rolled, not Supabase Auth** (`lib/auth.ts`): bcrypt-hashed passwords, JWT payload `{id, email, role}` signed and stored as an httpOnly `gtf_token` cookie. `api/auth/login` checks the `admins` table first, then `agents`. There is **no `middleware.ts`** — every protected API route does its own `getTokenFromCookie` + `verifyToken` + `payload.role` check (see `api/bookings/create`, `api/admin/approve` for the pattern). The `(agent)` and `(admin)` layouts render chrome only and do not gate access themselves; authorization lives entirely in the API routes the pages call, so a new protected page still needs its API calls to enforce the role check. New agent registrations start `status: 'pending'` and can't log in until an admin approves them via `api/admin/approve`.

**Supabase client uses only the anon key** (`lib/supabase.ts`, no service-role key anywhere in the repo) — RLS policies on the `admins`/`agents`/`quotes`/`bookings`/`departures` tables are what actually restrict access, so any new query needs to work under those policies rather than assuming server-side code bypasses RLS. Status enums to know: `agents.status`: pending/approved/rejected/suspended; `quotes.status`: created/sent/booking/...; `bookings.status`: pending/confirmed/cancelled; `departures.status`: available/fast-filling/sold-out.

**The package catalog is static, not database-backed**: `data/packages.ts` is the source of truth for tour content — itinerary, hotels, pricing, images, and each package's `departures[]`. Editing a package's content, pricing, or availability means editing `data/packages.ts`. The admin-only `api/admin/seed-departures` route upserts `departures` rows into Supabase from `data/packages.ts` so live seat counts (`total_seats`/`booked_seats`) can be tracked per departure without touching the static file.

**Quote → booking flow**: agent builds a quote against a package (`api/quotes/create`, starts `status: 'created'`) → a PDF proposal is generated via `lib/proposal-pdf.tsx` (`@react-pdf/renderer`, served from `api/quotes/pdf`) and the quote is marked `sent` → once `sent`, the agent can convert it via `api/bookings/create`, which requires the quote to belong to that agent and be in `sent` status, creates the `bookings` row, and flips the quote to `status: 'booking'`.

**Styling is inconsistent by design of the codebase, not a bug to "fix"**: `tailwind.config.ts` and `app/globals.css` define a shared teal/orange/`--ink` marketing palette (CSS custom properties + a few reusable classes like `.btn-teal`, `.badge-approved`), but most components — especially the agent dashboard and admin pages — use inline `style={{}}` objects with their own locally-declared hex color constant (a `const C = {...}` per file, often a different maroon/gold palette from the marketing site's teal). When editing a page, match that file's existing convention (inline styles + local palette, or the shared CSS vars/classes) rather than introducing a third approach.
