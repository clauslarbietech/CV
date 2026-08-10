#!/usr/bin/env bash
# Deploy Pix Bible into gh-pages:/pixbible/ only.
# Does NOT wipe the repo root (so FitLife / other apps can live at /CV/).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
WORKTREE="${PIXBIBLE_GH_PAGES_DIR:-/tmp/gh-pages-pixbible}"
SUBDIR="pixbible"
BRANCH="gh-pages"
REMOTE_URL="$(cd "$ROOT" && git remote get-url origin)"

if [ ! -f "$DIST/index.html" ]; then
  echo "Missing $DIST/index.html — run: npm run deploy:pages" >&2
  exit 1
fi

rm -rf "$WORKTREE"
git clone --branch "$BRANCH" --single-branch "$REMOTE_URL" "$WORKTREE"

# Replace only the Pix Bible subdirectory.
rm -rf "$WORKTREE/$SUBDIR"
mkdir -p "$WORKTREE/$SUBDIR"
cp -a "$DIST"/. "$WORKTREE/$SUBDIR"/

# Keep Pages happy even if root app omitted .nojekyll.
touch "$WORKTREE/.nojekyll"

# Optional root stub so /CV/pixbible is discoverable without fighting FitLife index.
cat > "$WORKTREE/pixbible.html" <<'HTML'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=./pixbible/" />
    <link rel="canonical" href="./pixbible/" />
    <title>Pix Bible</title>
  </head>
  <body>
    <p><a href="./pixbible/">Open Pix Bible</a></p>
  </body>
</html>
HTML

cd "$WORKTREE"
git add -A "$SUBDIR" pixbible.html .nojekyll
if git diff --cached --quiet; then
  echo "No Pix Bible pages changes to deploy."
  exit 0
fi

git -c user.name="Cursor Agent" -c user.email="cursoragent@users.noreply.github.com" \
  commit -m "Deploy Pix Bible to /pixbible/ (isolated from root apps)"
git push origin "$BRANCH"
echo "Live: https://clauslarbietech.github.io/CV/pixbible/"
