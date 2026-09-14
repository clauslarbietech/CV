# App Privacy (Nutrition Labels) — FitLife v1.0

Use this when filling out **App Privacy** in App Store Connect.

## Data collection summary (v1.0 default)

By default FitLife stores data **on device**. Declare only what you actually collect.

### If cloud sync / Supabase is **not** enabled (recommended for first submit)

- **Data Not Collected** from the app for analytics/tracking, OR  
- Collect only **Health & Fitness** / **Other User Content** as **linked to user** only if you sync accounts.

For a local-only first submit, Apple’s questionnaire can often be answered as collecting data that stays on device and is not used for tracking.

### Photos
- Optional progress photos selected by the user  
- Purpose: App Functionality (progress check-ins)  
- Not used for tracking  
- Not uploaded in v1.0

### Contact info / identifiers
- Only if the user creates an account (email) when cloud auth is enabled  
- Otherwise omit

### Tracking
- **No** — FitLife does not track users across apps/websites in v1.0

## Do not declare
- Food Scan / vision AI (removed)
- Health Research from Food Scan
- Precise Location
- Advertising data
