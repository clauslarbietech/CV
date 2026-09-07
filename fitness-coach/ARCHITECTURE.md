# FitLife AI Coach — Architecture

**Core promise:** YOUR FITNESS LIFE. ONE AI COACH.  
**Primary question answered:** “What should I do today to move closer to my fitness goal?”

---

## 1. Architecture Decision

| Layer | Choice | Rationale |
| --- | --- | --- |
| Mobile | React Native + Expo (SDK 53+) + TypeScript | Cross-platform iOS/Android, fast iteration, Expo Router file-based navigation |
| Navigation | Expo Router (tabs + stacks) | Type-safe routes, deep linking, clear screen map |
| Backend | **Supabase** (Option A) | Postgres relational model matches program/session schema; Auth, Storage, Edge Functions for AI proxy |
| Local state | Zustand | Lightweight UI + session state without Redux boilerplate |
| Server state | TanStack Query | Caching, retries, offline-friendly refetch for logs/metrics |
| AI | Server-side Edge Functions only | Never expose API keys; structured context builder; usage limits |
| Styling | StyleSheet + design tokens | Premium dark athletic theme; no heavy UI kit lock-in |

**Why not Firebase:** Fitness data is highly relational (programs → days → exercises → sessions → logs). Postgres + RLS is a better long-term fit than document modeling for this domain.

---

## 2. Technology Choices

- **Expo** with managed workflow (EAS Build for production later)
- **expo-router** for auth gate, onboarding stack, and 5-tab main shell
- **@supabase/supabase-js** + SecureStore session persistence
- **zod** for form/onboarding validation
- **date-fns** for streak/day logic
- **react-native-reanimated** / **gesture-handler** for polished interactions
- Env via `EXPO_PUBLIC_*` for Supabase URL/anon key only; secrets stay in Edge Functions

---

## 3. Database Plan (Supabase / PostgreSQL)

UUID PKs, `created_at` / `updated_at` on all tables, RLS per `auth.uid()`.

**Identity & profile:** `profiles`, `user_preferences`, `coach_preferences`, `fitness_goals`  
**Programs:** `programs`, `program_days`, `exercises`, `workout_exercises`, `user_programs`  
**Sessions:** `workout_sessions`, `exercise_logs`  
**Nutrition:** `nutrition_goals`, `daily_nutrition`, `meal_logs`, `meal_items`  
**Wellness:** `daily_checkins`, `body_measurements`, `progress_photos`  
**Gamification:** `achievements`, `user_achievements`, `xp_transactions`, `streaks`  
**Adherence:** `supplements`, `supplement_logs`, `medication_logs`  
**AI:** `ai_conversations`, `ai_messages`, `ai_usage_daily`  
**Integrations:** `wearable_connections`, `wearable_daily_metrics`, `notifications`, `subscriptions`

See `supabase/migrations/001_initial_schema.sql`.

---

## 4. Folder Structure

```
fitness-coach/
├── app/                      # Expo Router screens
│   ├── (auth)/               # Welcome, sign-in, sign-up
│   ├── (onboarding)/         # Assessment flow
│   ├── (tabs)/               # Today, Workouts, Coach, Nutrition, Progress
│   ├── workout/[id].tsx
│   ├── program/[id].tsx
│   ├── session/[id].tsx
│   └── profile.tsx
├── src/
│   ├── components/           # Reusable UI
│   ├── features/             # Domain modules
│   ├── services/             # Supabase, AI client stubs
│   ├── store/                # Zustand
│   ├── hooks/
│   ├── types/
│   ├── constants/            # Programs, ranks, XP
│   ├── theme/
│   └── utils/
├── supabase/migrations/
└── ARCHITECTURE.md
```

---

## 5. Screen Map

```
Auth Stack
  Welcome → Sign In | Sign Up

Onboarding Stack (first launch)
  Welcome Assessment → Basics → Goals → Training Setup
  → Equipment → Diet/Limits → Coach Personality → Notifications → Complete

Main Tabs
  Today          → Daily Mission, metrics, coach tip, Start Mission
  Workouts       → Featured OPERATION IRON 14, program library
  Coach          → Chat (Phase 6 stub in MVP)
  Nutrition      → Score + logging (Phase 5 stub in MVP)
  Progress       → Body / Performance / Consistency / Achievements

Stacks (from tabs)
  Program Detail → Day Detail → Workout Session → Completion
  Profile / Settings (header)
```

---

## 6. MVP Scope (this branch)

**Build now (Phases 1–4 foundation):**
1. App architecture, theme, navigation  
2. Auth screens (wired to Supabase; mock-local fallback for offline demo)  
3. Onboarding assessment flow  
4. User profile store  
5. Today screen (TODAY’S MISSION)  
6. Workouts library with **OPERATION IRON 14** featured first  
7. Full Iron 14 program data + day detail  
8. Workout session tracker  
9. Basic Progress screen (streaks, XP, body placeholders)

**Defer (do not build yet):**
- Live LLM coaching, food photo/voice AI, barcode  
- Wearables (HealthKit / Health Connect)  
- Supplements / medication schedules (schema only)  
- Weekly AI reports generation  
- Premium subscriptions / pricing  
- Restaurant / grocery assistants  
- Full nutrition AI “decide before you eat” scoring engine  

---

## 7. Development Milestones

### CRITICAL PRIORITY OVERRIDE

**OPERATION IRON 14 is the core product.** Phase 1 is incomplete until:

1. Onboard → enroll Iron 14  
2. Start Day 1 mission  
3. Step-through session engine (rounds, reps, rest, skip/modify)  
4. Save completion  
5. Auto-unlock Day 2  
6. Today reflects current mission  

Do **not** expand nutrition, AI chat, or wearables until that loop works.

| Milestone | Deliverable |
| --- | --- |
| M1 | Expo app + theme + tabs + auth shells |
| M2 | Onboarding (fat loss / recomposition focus) |
| M3 | Operation Iron 14 data model (14 days + tiers) |
| M4 | **Workout Session Engine** (step flow, rest timer, logs) |
| M5 | Today mission screen bound to Iron 14 |
| M6 | Completion → Day N+1 progression + basic progress |
| M7 | Supabase persistence for sessions (next hardening) |
| M8 | Nutrition / AI coach (only after M1–M6 proven) |

---

## 8. Safety & AI Principles

- All AI calls via backend; structured context JSON only (no full history dump)  
- Rate limits on free tier AI usage  
- No diagnosis, no medication advice, no dangerous restriction guidance  
- Nutrition estimates are estimates; user can edit  
- Substitute exercises; never encourage training through severe pain  
