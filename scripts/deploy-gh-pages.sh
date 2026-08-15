#!/usr/bin/env bash
# Export Expo web static build and publish to gh-pages (GitHub Pages).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Exporting web build"
npx expo export --platform web

if [[ ! -d dist ]]; then
  echo "ERROR: dist/ missing after export" >&2
  exit 1
fi

# SPA/static hosting helpers for GitHub Pages project sites
touch dist/.nojekyll
# Optional root redirect helper if someone hits the repo Pages URL oddly
if [[ ! -f dist/404.html && -f dist/index.html ]]; then
  cp dist/index.html dist/404.html
fi

WORK="$(mktemp -d)"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

echo "==> Publishing to gh-pages"
git clone --depth 1 --branch gh-pages \
  "https://github.com/clauslarbietech/bible-app.git" "$WORK/pages" 2>/dev/null \
  || {
    mkdir -p "$WORK/pages"
    git -C "$WORK/pages" init
    git -C "$WORK/pages" checkout -b gh-pages
    git -C "$WORK/pages" remote add origin "https://github.com/clauslarbietech/bible-app.git"
  }

# Replace published content with fresh export
find "$WORK/pages" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -a dist/. "$WORK/pages/"

git -C "$WORK/pages" add -A
if git -C "$WORK/pages" diff --cached --quiet; then
  echo "No Pages changes to publish."
  exit 0
fi

git -C "$WORK/pages" \
  -c user.name='bible-app-bot' \
  -c user.email='bible-app-bot@users.noreply.github.com' \
  commit -m "Publish web preview $(date -u +%Y-%m-%dT%H:%MZ)"

git -C "$WORK/pages" push -u origin gh-pages

echo "Live: https://clauslarbietech.github.io/bible-app/"
