#!/usr/bin/env bash
# Run on your machine (with push access to clauslarbietech/bible-app):
#   bash scripts/push-bible-app-from-export.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TGZ="$ROOT/exports/bible-app.tgz"
WORKDIR="$(mktemp -d)"
cleanup() { rm -rf "$WORKDIR"; }
trap cleanup EXIT

git clone git@github.com:clauslarbietech/bible-app.git "$WORKDIR/repo" \
  || git clone https://github.com/clauslarbietech/bible-app.git "$WORKDIR/repo"

tar -C "$WORKDIR/repo" -xzf "$TGZ"
cd "$WORKDIR/repo"
git add -A
git status -sb
git commit -m "Import Anime Audio Bible app with Pages preview" || true
git push -u origin HEAD:main

echo "Pushed. Next: enable GitHub Pages (Settings → Pages → Deploy from branch gh-pages)"
echo "or wait for the Actions workflow on main to publish:"
echo "https://clauslarbietech.github.io/bible-app/"
