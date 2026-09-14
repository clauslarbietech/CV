# FitLife — App Store launch checklist (v1.0 free)

**Ship surface:** home workouts, fuel tracks, notes/meds, scripted coach tips, on-device progress photos.

**Removed from v1.0 (would fail Apple review):** Food Scan filename “AI”, Live Trainer human inbox, viral crash diets / sardine protocols, unfinished native camera/audio stubs.

**Bundle ID:** `com.fitlife.aicoach` (unchanged)  
**Display name:** FitLife  
**Version:** `1.0.0`

**Privacy:** https://clauslarbietech.github.io/CV/fitlife/legal/privacy.html  
**Terms:** https://clauslarbietech.github.io/CV/fitlife/legal/terms.html  
**Support:** https://clauslarbietech.github.io/CV/fitlife/legal/support.html  

---

## Codebase status

| Requirement | Status |
|-------------|--------|
| Privacy + Terms in-app and hosted | ✅ |
| Support URL hosted | ✅ |
| Health disclaimer + onboarding checkbox | ✅ |
| Coach tips labeled as scripted (not live AI) | ✅ |
| No Food Scan / fake vision AI | ✅ removed |
| No Live Trainer human inbox | ✅ removed |
| No viral under-fuel diet menus | ✅ removed |
| Progress photos via photo library | ✅ |
| Delete all data on device | ✅ |
| Encryption flag false | ✅ |
| Privacy Manifest | ✅ |
| No StoreKit / IAP in v1.0 | ✅ |

---

## Apple Connect steps

1. Create app named **FitLife** with bundle `com.fitlife.aicoach`
2. Paste listing from `docs/APP_STORE_LISTING.md`
3. Screenshots + Privacy Nutrition Labels (`docs/PRIVACY_NUTRITION_LABELS.md`)
4. Configure `support@fitlife.app`
5. `eas init` + set `ascAppId` in `eas.json`
6. Build / submit:

```bash
cd fitness-coach
npm install --legacy-peer-deps
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

### Review notes

```text
FitLife v1.0 — free home workout app.

Demo: complete onboarding (accept health checkbox) → My Stuff → Start workout.

Coach tips are scripted motivational replies (not live AI, not a human coach).
No food-scan AI and no live trainer connection in this build.

Privacy / Terms / Support URLs are linked in App Store Connect and in Settings.
Delete data: Settings → Delete all data on this device
```

---

## Device smoke

- [ ] Fresh install → onboarding → health terms → My Stuff  
- [ ] Complete one workout set  
- [ ] Nutrition shows fuel tracks only (no Food Scan / viral diets)  
- [ ] Notes → Tips shows scripted coach disclaimer  
- [ ] Progress photo add from library works on device  
- [ ] Settings legal links + delete data  
- [ ] Airplane mode does not crash  
