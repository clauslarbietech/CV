# Relatii

**Fewer questions. Clearer connection.**

Stage 1 — Match MVP foundation for the Relatii relationship-intelligence app.
Lives in `relatii/` beside the existing CV site and FitLife coach.

## What’s in this slice

- Expo + TypeScript app shell with Day / Night / System themes
- Design tokens from the Master Brief (aubergine, ivory, coral/magenta, violet DNA, mint)
- Welcome → 3-tap onboarding → provisional DNA preview (guest-persisted)
- Curated Discover (demo profiles) + Why You Align explanations
- Settings: theme override + reset guest journey

## Stack

Expo 57 · Expo Router · Zustand · AsyncStorage · Fraunces + DM Sans

Canonical V1 backend (Firebase + AI Gateway) is deferred until structured-signal
flows are solid. This preview runs fully local.

## Setup

```bash
cd relatii
npm install --legacy-peer-deps
npm run web
```

Then open the Expo web URL (default `http://localhost:8082` when FitLife uses 8081).

## Product rules baked in

- 18+ age gate copy on welcome
- No therapy / diagnosis / soulmate claims
- DNA is an early editable sketch (~20% clarity after three taps)
- Alignment bands, not false-precision percentages
- AI never auto-sends (messaging + AI Gateway come later)

## Next vertical slices

1. Auth + basic profile + photos/prompts  
2. DNA signal model + Pulse engine  
3. Rule-based eligibility matching + mutual connect  
4. Chat + block/report  
5. Server-side AI Gateway  

See the uploaded *Relatii Cursor Development Master Brief* for full acceptance criteria.
