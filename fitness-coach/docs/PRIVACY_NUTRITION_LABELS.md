# App Privacy — Nutrition Labels (App Store Connect)

Use this when filling out **App Privacy** in App Store Connect for FitLife AI Coach v1.0.

---

## Data collection summary

| Question | Answer |
|----------|--------|
| Do you or third-party partners collect data from this app? | **Yes** (user-entered, on-device) |
| Is data used to track users? | **No** |
| Is data linked to the user? | **Yes** (profile they enter) |
| Is data used for third-party advertising? | **No** |

---

## Data types to declare

### Contact info
| Type | Collected | Linked | Tracking | Purpose |
|------|-----------|--------|----------|---------|
| Name | Yes | Yes | No | App functionality |
| Email address | Optional | Yes | No | App functionality (if user signs in when cloud sync enabled) |

### Health & fitness
| Type | Collected | Linked | Tracking | Purpose |
|------|-----------|--------|----------|---------|
| Fitness | Yes | Yes | No | App functionality |
| Health | Yes | Yes | No | App functionality |

Notes: weight, goals, workout logs, med checklists (user-entered tracking only).

### User content
| Type | Collected | Linked | Tracking | Purpose |
|------|-----------|--------|----------|---------|
| Photos or videos | Optional | Yes | No | App functionality |

Notes: Food Scan beta — user-selected photos processed on-device; not uploaded in v1.0 unless cloud features are later enabled.

### Identifiers
| Type | Collected | Linked | Tracking | Purpose |
|------|-----------|--------|----------|---------|
| User ID | Optional | Yes | No | App functionality |

Notes: local guest ID or Supabase user ID when configured.

---

## Do NOT declare (v1.0)

- Precise location
- Contacts (unless you add contact-picker features later)
- Browsing history
- Search history (beyond in-app)
- Purchases (no IAP in v1.0)
- Diagnostics / crash data (unless you add Sentry/Firebase later)

---

## Privacy manifest (codebase)

Configured in `app.config.js` under `ios.privacyManifests`:

- `NSPrivacyTracking`: false
- UserDefaults (AsyncStorage): CA92.1
- File timestamp APIs: C617.1

---

## Account & data deletion

- In-app: **Settings → Delete all data on this device**
- Cloud: email support@fitlife.app (when Supabase sync is enabled)

Document this in App Review notes.
