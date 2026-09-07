# FitLife — Apple App Store Subscription Approval Checklist

Use this before submitting FitLife with auto-renewable subscriptions.
Aligned with [App Store Review Guidelines §3.1.1 / §3.1.2](https://developer.apple.com/app-store/review/guidelines/) and common rejection causes.

**Status key:** `[ ]` todo · `[x]` done · `[~]` partial / blocked

---

## 0. Current FitLife gap (do this first)

FitLife does **not** ship StoreKit / IAP yet (billing is listed as future in README).
Do **not** submit a paid subscription build until these exist:

| # | Item | Status |
| --- | --- | --- |
| 0.1 | StoreKit 2 (or RevenueCat) wired for iOS | `[ ]` |
| 0.2 | Subscription products created in App Store Connect | `[ ]` |
| 0.3 | Paywall UI with price, period, trial, restore | `[ ]` |
| 0.4 | Free vs paid value clearly differentiated in-app | `[ ]` |
| 0.5 | Server / local entitlement unlock for premium features | `[ ]` |
| 0.6 | Privacy Policy + Terms of Use live URLs | `[ ]` |
| 0.7 | Sign in with Apple (if any other 3rd-party login) | `[ ]` |

---

## 1. App Store Connect — products

| # | Item | Notes | Status |
| --- | --- | --- | --- |
| 1.1 | Subscription **group** created (e.g. FitLife Premium) | One group for upgrade/downgrade | `[ ]` |
| 1.2 | Products: e.g. Monthly + Yearly (optional weekly) | Localizations for each storefront | `[ ]` |
| 1.3 | Display names / descriptions match paywall copy | No “best deal” lies | `[ ]` |
| 1.4 | Free trial / intro offer configured if advertised | Must match in-app text | `[ ]` |
| 1.5 | Products in **Ready to Submit** / submitted with binary | New IAPs need a new app version | `[ ]` |
| 1.6 | Sandbox testers created | Reviewers + your QA | `[ ]` |
| 1.7 | Paid Apps Agreement / banking / tax complete | Contracts, Tax, and Banking | `[ ]` |

---

## 2. Paywall & purchase UX (Guideline 3.1.2)

| # | Item | Status |
| --- | --- | --- |
| 2.1 | Price + billing period visible **before** purchase (e.g. “$9.99/month”) | `[ ]` |
| 2.2 | Auto-renewal disclosed clearly | `[ ]` |
| 2.3 | What you get for the price listed (features / content) | `[ ]` |
| 2.4 | Free vs paid difference obvious | `[ ]` |
| 2.5 | Terms partially visible without scrolling (readable font) | `[ ]` |
| 2.6 | Links: **Privacy Policy** + **Terms of Use** on paywall | `[ ]` |
| 2.7 | How to cancel explained (Settings → Apple ID → Subscriptions) | `[ ]` |
| 2.8 | Visible **Restore Purchases** control | `[ ]` |
| 2.9 | No dark patterns (hidden close, fake urgency, forced highest tier) | `[ ]` |
| 2.10 | All digital unlocks use Apple IAP only (no external checkout for digital) | `[ ]` |

---

## 3. Runtime / entitlement behavior

| # | Item | Status |
| --- | --- | --- |
| 3.1 | Purchase completes in Sandbox and unlocks premium | `[ ]` |
| 3.2 | Restore works (Production first, then Sandbox fallback) | `[ ]` |
| 3.3 | Expired / cancelled sub returns user to free tier | `[ ]` |
| 3.4 | Entitlement works across devices for same Apple ID | `[ ]` |
| 3.5 | App handles interrupted / pending transactions | `[ ]` |
| 3.6 | No crash if StoreKit unavailable / offline | `[ ]` |

---

## 4. Metadata & binary (Guideline 2.3)

| # | Item | Status |
| --- | --- | --- |
| 4.1 | App description mentions what requires subscription | `[ ]` |
| 4.2 | Screenshots / preview match current build | `[ ]` |
| 4.3 | IAP promotional metadata (if used) is appropriate | `[ ]` |
| 4.4 | Age rating / health disclaimers accurate (fitness content) | `[ ]` |
| 4.5 | Privacy Nutrition Labels match actual data collection | `[ ]` |
| 4.6 | Export compliance / encryption answers correct | `[ ]` |

---

## 5. App Review Notes (paste into ASC)

Provide:

| # | Item | Status |
| --- | --- | --- |
| 5.1 | Demo account (free / onboarded) username + password | `[ ]` |
| 5.2 | Second account showing **expired** subscription (optional but helps) | `[ ]` |
| 5.3 | Exact path to paywall (tap path) | `[ ]` |
| 5.4 | Exact path to Restore Purchases | `[ ]` |
| 5.5 | Note: “Use Sandbox Apple ID for IAP; no real charge” | `[ ]` |
| 5.6 | Backend / APIs live during review window | `[ ]` |

**Template:**

```text
FitLife AI Coach — Review notes

FREE DEMO
Email: ___
Password: ___

PAYWALL
1. Open app → complete splash
2. Go to: Settings (or Discover) → [Premium / Subscribe]
3. Products: Monthly ___ / Yearly ___
4. Restore: button on paywall + Settings

SANDBOX
Please use a Sandbox Apple ID for purchases.
Subscriptions unlock: [list premium features].
Free tier still includes: [list].
```

---

## 6. Fitness / health specific

| # | Item | Status |
| --- | --- | --- |
| 6.1 | Medical disclaimer (not medical advice) in app + metadata | `[ ]` |
| 6.2 | Nutrition / diet protocols framed with safety limits (already started for sardine lesson) | `[~]` |
| 6.3 | No disease cure claims | `[ ]` |
| 6.4 | HealthKit usage (if added later) has clear purpose strings | `[ ]` |

---

## 7. Pre-submit smoke (device)

| # | Item | Status |
| --- | --- | --- |
| 7.1 | Fresh install → splash → onboarding → My Stuff | `[ ]` |
| 7.2 | Return to app → splash replays | `[ ]` |
| 7.3 | Day mode is true white | `[ ]` |
| 7.4 | Start mission / complete set (no crash) | `[ ]` |
| 7.5 | Paywall → purchase (Sandbox) → unlock | `[ ]` |
| 7.6 | Kill app → relaunch → still entitled | `[ ]` |
| 7.7 | Restore on second device / reinstall | `[ ]` |

---

## 8. After approval

| # | Item | Status |
| --- | --- | --- |
| 8.1 | Confirm IAPs show **Approved** before relying on them | `[ ]` |
| 8.2 | Promo codes (generated only after approval; limited for subs) | `[ ]` |
| 8.3 | Monitor first 48h crash / refund / review notes | `[ ]` |

---

## Suggested FitLife premium packaging (when you implement)

- **Free:** splash, onboarding, 1 active program, basic My Stuff graphs, Discover browse  
- **Premium (sub):** full program library, squad chat / day log sync, AI coach, advanced nutrition plans, Progress research unlocks  

Wire unlocks only through StoreKit entitlements — never a custom web checkout for those digital features.
