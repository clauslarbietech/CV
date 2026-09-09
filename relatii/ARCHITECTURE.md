# Relatii Architecture (Stage 1 Match)

## Ideology

Explainable Relationship DNA → intentional discovery → mutual match → conversation.
Not therapy, not diagnosis, not autonomous dating.

## App map (current)

| Route | Purpose |
| --- | --- |
| `/(onboarding)/welcome` | Brand + Start matching |
| `/(onboarding)/taps` | 3-tap signals (intention, children, priorities) |
| `/(onboarding)/dna` | Provisional DNA reveal + Save |
| `/(tabs)/discover` | Curated 3–5 profile set |
| `/why/[id]` | Why You Align panel |
| `/(tabs)/dna` | Inspect DNA pillars |
| `/(tabs)/settings` | Theme + guest reset |

## Data (local guest)

`relatii-match-guest` in AsyncStorage holds onboarding answers, provisional DNA,
and connect interest IDs so guest progress survives refresh / account-create handoff.

## Deferred

Firebase Auth/Firestore, AI Gateway, Vent, Rehearsal, Couple Mode, subscriptions.
