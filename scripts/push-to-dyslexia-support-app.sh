#!/usr/bin/env bash
set -euo pipefail
# Run from a machine with write access to clauslarbietech/Dyslexia-support-app
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/dyslexia-support-app"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 https://github.com/clauslarbietech/Dyslexia-support-app.git "$TMP/repo"
cd "$TMP/repo"
git checkout -b cursor/port-lexrise-app-5aee

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete --exclude .git "$SRC"/ ./
else
  # fallback without rsync
  find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
  cp -a "$SRC"/. ./
fi

git add -A
git status --short | head -40
git commit -m "$(cat <<'MSG'
Port HERO dyslexia app into dedicated repo

Move the LexRise/HERO reading platform out of the CV monorepo into
Dyslexia-support-app, with Speed fade-in intro as the brand logo and
GitHub Pages basePath for this repository.
MSG
)"
git push -u origin cursor/port-lexrise-app-5aee
gh pr create --repo clauslarbietech/Dyslexia-support-app \
  --base main \
  --head cursor/port-lexrise-app-5aee \
  --title "Port HERO + Speed dyslexia app into this repo" \
  --body "## Summary
Ports the HERO inclusive reading app (from CV/lexrise) into this dedicated repository, including the Speed fade-in intro logo.

### Includes
- Splash / onboarding / home / games / reader / learning profile
- Speed hero fade-in intro (dyslexia-friendly, skippable)
- Standalone Next.js app at repo root
- GitHub Pages basePath \`/Dyslexia-support-app\`
"
