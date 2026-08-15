# Anime Audio Bible

Free, non-commercial Bible app (Genesis → Revelation) with illustrated reading,
ESV scripture (Crossway API + local cache), and a fade-in launch intro.

**Art direction:** whimsical ink-and-watercolor — warm terracotta, golden ochre,
and deep teal with crisp dark ink outlines.

## Preview

- **GitHub Pages:** https://clauslarbietech.github.io/bible-app/
- **Local web preview:** `npm run preview` → http://localhost:8081

## Stack

- React Native + Expo SDK 57 (TypeScript)
- NativeWind v4 (Tailwind CSS)
- React Native Reanimated
- Crossway ESV API (`api.esv.org`) with AsyncStorage caching

## Phase 1 (current)

- Project rules (`.cursorrules`)
- Environment template (`.env.example`)
- ESV scripture service with local cache + mandatory Crossway attribution
- Launch fade-in intro (FitLife-style splash timing)
- Genesis 1 reader screen with comic panel placeholder and AI drawer entry point
- GitHub Pages web preview pipeline

## Setup

```bash
npm install
cp .env.example .env
# Add your Crossway ESV API key as EXPO_PUBLIC_ESV_API_KEY
npm run preview
```

Optional Pages deploy from a machine with push access:

```bash
npm run deploy:pages
```

Get an API key from [api.esv.org](https://api.esv.org/).

## Legal

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard
Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers.
Used by permission. All rights reserved. [www.esv.org](https://www.esv.org)
