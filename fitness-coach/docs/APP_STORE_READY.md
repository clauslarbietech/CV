# FitLife — App Store launch checklist (v1.0 free)

**Goal:** Submit a free, honest home-workout app to Apple.

**Bundle ID:** `com.fitlife.aicoach`  
**Version:** `1.0.0` · **Build:** auto-increment via EAS production  

**Privacy:** https://clauslarbietech.github.io/CV/fitlife/legal/privacy.html  
**Terms:** https://clauslarbietech.github.io/CV/fitlife/legal/terms.html  
**Support:** https://clauslarbietech.github.io/CV/fitlife/legal/support.html  

---

## Codebase status (ready)

| Requirement | Status |
|-------------|--------|
| Privacy + Terms in-app and hosted | ✅ |
| Support URL hosted | ✅ |
| Health disclaimer + onboarding checkbox | ✅ |
| Coach / Trainer inbox labeled **beta** (scripted, no live AI/human) | ✅ |
| Food Scan beta + photo library picker (`expo-image-picker`) | ✅ |
| Delete all data on device (Settings) | ✅ |
| `ITSAppUsesNonExemptEncryption: false` | ✅ |
| Apple Privacy Manifest (UserDefaults + FileTimestamp) | ✅ |
| Photo library usage string (no unused camera permission) | ✅ |
| EAS profiles (development / preview / production) | ✅ |
| Listing + Privacy Nutrition Label docs | ✅ |
| No StoreKit / IAP in v1.0 | ✅ (by design) |

---

## Your Apple-side steps (blocking)

Do these in order:

1. **Apple Developer Program** — active enrollment  
2. **App Store Connect → New App**  
   - Name: FitLife AI Coach  
   - Bundle ID: `com.fitlife.aicoach`  
   - Primary language: English  
   - Category: Health & Fitness  
3. **Copy listing text** from `docs/APP_STORE_LISTING.md`  
4. **Paste Privacy / Support / Terms URLs** above  
5. **App Privacy (Nutrition Labels)** — follow `docs/PRIVACY_NUTRITION_LABELS.md`  
6. **Age rating questionnaire** — expect 4+ or 12+  
7. **Screenshots** — at least 6.7" and 6.5" iPhone (see listing doc ideas)  
8. **Configure `support@fitlife.app`** inbox (or update email everywhere before submit)  
9. **EAS project link**

```bash
cd fitness-coach
npm install --legacy-peer-deps
npx eas-cli login
npx eas init          # writes projectId into app config
# Paste App Store Connect App ID into eas.json → submit.production.ios.ascAppId
```

10. **Build + TestFlight**

```bash
npx eas build --platform ios --profile preview
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

11. **App Review notes** (paste into Connect):

```text
FitLife AI Coach v1.0 — free home workout app.

Demo: complete onboarding (accept health checkbox) → My Stuff → Start workout.

Coach chat uses scripted beta replies, not live AI.
Trainer inbox saves notes locally only — no human connected.
Food Scan is beta (filename-based estimates from a photo you pick).

Privacy: https://clauslarbietech.github.io/CV/fitlife/legal/privacy.html
Terms: https://clauslarbietech.github.io/CV/fitlife/legal/terms.html
Support: https://clauslarbietech.github.io/CV/fitlife/legal/support.html
Delete data: Settings → Delete all data on this device
```

---

## Device smoke (before Submit for Review)

- [ ] Fresh install → onboarding → accept health terms → My Stuff  
- [ ] Start and complete one workout set  
- [ ] Nutrition → Food Scan → pick a photo (library)  
- [ ] Settings → Privacy / Terms / Support open  
- [ ] Settings → Delete all data (test device only)  
- [ ] Notes → Coach (beta) shows disclaimer  
- [ ] Kill app → relaunch → still on My Stuff  
- [ ] Airplane mode does not crash  

---

## Do not advertise in v1.0

- Live LLM / “real AI coach”  
- Human live trainer  
- Subscriptions / paywall  
- Cloud buddy sync (unless Supabase is intentionally enabled)  
- Medical claims or guaranteed results  

See `APPLE_SUBSCRIPTION_APPROVAL_CHECKLIST.md` when you add paid plans later.
