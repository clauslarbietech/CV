# Anime Audio Bible

A free, non-commercial Bible mobile app (Genesis through Revelation) featuring a continuous vertical webtoon-style comic reader, synchronized audio narration, and a gesture-driven AI study chat drawer.

**Art direction:** whimsical ink-and-watercolor graphic novel aesthetic — warm terracotta, golden ochre, and deep teal with crisp dark ink outlines.

## Stack

- React Native + Expo (TypeScript)
- NativeWind v4 (Tailwind CSS)
- React Native Reanimated
- Crossway ESV API (`api.esv.org`) with AsyncStorage caching

## Current experience (Through the Word–style)

- **Full Genesis 1–50** chapter journey (free) with ESV audio guides
- Illustrated webtoon storylines: Creation Days 1–7, Eve from Adam’s side, The Fall
- Vertical panels with **ESV scripture**, dialogue bubbles, and **per-scene audio**
- Family-safe Eden framing (naked without shame · bush/branch covering)
- Chapters 4–50 ready as ESV listening guides; anime art ships storyline-by-storyline
- TTW-style tabs, listening progress, voice reflection
- ESV passage fetch + mandatory Crossway attribution

## Review on GitHub Pages

Web preview build is on the **`gh-pages`** branch.

**One-time setup** (repo owner):
1. Open [Settings → Pages](https://github.com/clauslarbietech/CV/settings/pages)
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Branch: **`gh-pages`**, folder: **`/` (root)** → **Save**

Then open: **https://clauslarbietech.github.io/CV/**

> Note: Pages is currently set to `main`. Switching to `gh-pages` replaces the old static CV site at that URL (the old site is archived in `archive/personal-site/`).

## Setup

```bash
npm install
cp .env.example .env
# Add your Crossway ESV API key to .env as EXPO_PUBLIC_ESV_API_KEY
npx expo start
```

Get an API key from [api.esv.org](https://api.esv.org/).

Rebuild the GitHub Pages preview anytime with:
```bash
npx expo export --platform web
```

## Legal

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. [www.esv.org](https://www.esv.org)
