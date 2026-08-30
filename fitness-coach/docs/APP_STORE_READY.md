# FitLife — App Store Readiness (v1.0 free launch)

Use this checklist before submitting **FitLife AI Coach** to App Store Connect.

**Privacy Policy URL (App Store Connect):**  
https://clauslarbietech.github.io/CV/fitlife/legal/privacy.html

**Support URL (App Store Connect):**  
https://clauslarbietech.github.io/CV/fitlife/legal/support.html

**Terms of Use URL:**  
https://clauslarbietech.github.io/CV/fitlife/legal/terms.html

---

## Done in codebase

| Item | Status |
|------|--------|
| Privacy Policy (in-app + web) | ✅ |
| Terms of Use (in-app + web) | ✅ |
| Health disclaimer (onboarding checkbox + Settings) | ✅ |
| Coach / Live Trainer labeled beta (no false AI claims) | ✅ |
| Food Scan beta warning | ✅ |
| iOS camera/photo usage strings | ✅ |
| Export compliance flag (`ITSAppUsesNonExemptEncryption: false`) | ✅ |
| EAS Build config (`eas.json`) | ✅ |
| Bundle ID `com.fitlife.aicoach` | ✅ |
| Apple Privacy Manifest (`ios.privacyManifests`) | ✅ |
| Support URL (hosted) | ✅ |
| Delete my data (Settings) | ✅ |
| App Store listing copy (`docs/APP_STORE_LISTING.md`) | ✅ |
| Privacy Nutrition Labels guide | ✅ |

---

## You must do in App Store Connect

1. **Apple Developer account** — enroll at developer.apple.com  
2. **Create app** — FitLife AI Coach, bundle ID `com.fitlife.aicoach`  
3. **Privacy Policy URL** — paste link above  
4. **Support URL** — paste support link above  
5. **Age rating** — likely 4+ or 12+ (fitness, no mature content)  
6. **Privacy Nutrition Labels** — see `docs/PRIVACY_NUTRITION_LABELS.md`  
7. **Screenshots** — 6.7" and 6.5" iPhone required (ideas in `docs/APP_STORE_LISTING.md`)  
8. **App Review notes:**

```text
FitLife AI Coach v1.0 — free home workout app.

Demo: complete onboarding (accept health checkbox) → My Stuff → Start workout.

Coach chat uses scripted beta replies, not live AI.
Live Trainer saves notes locally only — no human connected.
Food Scan is beta (filename-based estimates).

Privacy: https://clauslarbietech.github.io/CV/fitlife/legal/privacy.html
Terms: https://clauslarbietech.github.io/CV/fitlife/legal/terms.html
Support: https://clauslarbietech.github.io/CV/fitlife/legal/support.html
Delete data: Settings → Delete all data on this device
```

---

## Build & submit (TestFlight)

```bash
cd fitness-coach
npm install --legacy-peer-deps
npx eas-cli login
npx eas build --platform ios --profile preview   # TestFlight internal
npx eas build --platform ios --profile production # App Store
npx eas submit --platform ios --profile production
```

First time: run `eas init` and link the Expo project. Replace `ascAppId` in `eas.json`.

---

## Not in v1.0 (do not advertise)

- Live AI / LLM coach  
- Human live trainer connection  
- Subscriptions / StoreKit (see `APPLE_SUBSCRIPTION_APPROVAL_CHECKLIST.md` for paid launch)  
- Cloud buddy sync (local-only unless Supabase configured)  
- Real food vision AI  

---

## Pre-submit device smoke

- [ ] Fresh install → onboarding → accept health terms → My Stuff  
- [ ] Start and complete one workout set  
- [ ] Settings → Privacy Policy + Terms + Support open  
- [ ] Settings → Delete my data (optional smoke — use test device)  
- [ ] Notes → Coach (beta) shows disclaimer  
- [ ] Kill app → relaunch → still on My Stuff (not welcome)  
- [ ] No crash on airplane mode  

---

## Support

Email: support@fitlife.app (configure inbox before launch)
