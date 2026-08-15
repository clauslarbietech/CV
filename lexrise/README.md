# HERO

Inclusive reading and learning platform prototype (web MVP).

**HERO** — Read differently. Learn differently. Be powerful.

## Run

```bash
cd lexrise
npm install
npm run dev
```

Open `/splash` for onboarding, or `/home` after setup.

## MVP prototype flow

Splash → Who is HERO for? → Goals → Reading Style → Home → Read / Scan / Reader / Listen / Games / Progress / Profile

**Signature loop:** Scan text → Reader (accessible presentation) → Listen with highlights → Save to Library

## Architecture (client MVP)

```
User → Accessibility Profile → Learning Profile → Activity Engine → Performance Events → Adaptation
```

Stored locally until backend (PostgreSQL + API) is added.

## Important

HERO **supports** reading—it does **not** diagnose dyslexia. HERO Mind is separate from dyslexia intervention claims. Kids mode avoids shame-based streak mechanics.
