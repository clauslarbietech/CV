# Dyslexia Support App (HERO)

Inclusive reading and learning platform — moved here from the CV monorepo as its own home.

**HERO** — Read differently. Learn differently. Be powerful.

Brand mascot: **Speed** (smooth fade-in intro logo).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Start at `/splash` for onboarding, or `/home` after setup.

## Flow

Splash (Speed fade-in) → Who is HERO for? → Goals → Reading Style → Home → Read / Scan / Reader / Listen / Games / Progress / Profile

**Signature loop:** Scan text → Reader (accessible presentation) → Listen with highlights → Save to Library

## Features

- Speed hero fade-in intro (dyslexia-friendly motion, skippable, reduced-motion aware)
- Font Lab — Lexend, OpenDyslexic, size, spacing, contrast
- Phonics / letter games and Structured Literacy practice
- Accomplishments, research notes, and adaptive learning profile

## GitHub Pages

```bash
GITHUB_PAGES=1 npm run build
```

Static export uses `basePath` `/Dyslexia-support-app`.

## Important

This app **supports** reading—it does **not** diagnose dyslexia. Kids mode avoids shame-based streak mechanics.
