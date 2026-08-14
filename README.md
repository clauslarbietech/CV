# Anime Audio Bible

A free, non-commercial Bible mobile app (Genesis through Revelation) featuring a continuous vertical webtoon-style comic reader, synchronized audio narration, and a gesture-driven AI study chat drawer.

**Art direction:** whimsical ink-and-watercolor graphic novel aesthetic — warm terracotta, golden ochre, and deep teal with crisp dark ink outlines.

## Stack

- React Native + Expo (TypeScript)
- NativeWind v4 (Tailwind CSS)
- React Native Reanimated
- Crossway ESV API (`api.esv.org`) with AsyncStorage caching

## Phase 1 (current)

- Project rules (`.cursorrules`)
- Environment template (`.env.example`)
- ESV scripture service with local cache + mandatory attribution
- Launch fade-in intro (same motion timing as the FitLife splash)
- Genesis 1 webtoon reader screen with sticky ESV copyright footer and AI drawer placeholder

## Setup

```bash
npm install
cp .env.example .env
# Add your Crossway ESV API key to .env as EXPO_PUBLIC_ESV_API_KEY
npx expo start
```

Get an API key from [api.esv.org](https://api.esv.org/).

## Legal

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. [www.esv.org](https://www.esv.org)
