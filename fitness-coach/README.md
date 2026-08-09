# FitLife AI Coach

**YOUR FITNESS LIFE. ONE AI COACH.**

Production-oriented React Native (Expo) foundation for an AI-powered fitness platform: personalized coaching, structured programs, nutrition, accountability, and progress.

Existing CV site files at the repo root are unchanged. This app lives in `fitness-coach/`.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for technology choices, schema plan, screen map, MVP vs deferred scope, and milestones.

**Stack:** Expo + TypeScript · Expo Router · Zustand · TanStack Query · Supabase (preferred)

## MVP included (Phase 1–4 foundation)

- Auth (Supabase-ready + local/guest fallback)
- AI fitness assessment onboarding
- 5-tab navigation: Today · Workouts · Coach · Nutrition · Progress
- Featured program: **OPERATION IRON 14** (full 14-day data + tiers)
- Workout session tracker with timer, difficulty rating, XP
- Progress: streaks, XP/ranks, Iron 14 badge progress
- Supabase SQL migration + AI context builder stub

## Deferred (by design)

Live LLM chat, food photo/voice AI, wearables, premium billing, weekly AI report generation, barcode scanning.

## Setup

```bash
cd fitness-coach
npm install --legacy-peer-deps
cp .env.example .env
# Optional: set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npm start
```

Without Supabase credentials the app runs in local demo mode (guest / local auth + AsyncStorage).

Apply the database schema from `supabase/migrations/001_initial_schema.sql` in your Supabase project when ready.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Expo dev server |
| `npm run ios` / `android` / `web` | Platform targets |
| `npm run typecheck` | TypeScript check |

## Safety

No medical diagnosis, no medication advice, no unsafe restriction guidance. Nutrition estimates are editable. AI keys never ship in the mobile client.
