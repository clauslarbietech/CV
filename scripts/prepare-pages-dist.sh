#!/usr/bin/env bash
set -euo pipefail

# Disable Jekyll processing on GitHub Pages.
touch dist/.nojekyll
cp dist/index.html dist/404.html

# GitHub Pages often refuses to publish folders starting with "_" (e.g. _expo).
if [ -d dist/_expo ]; then
  mv dist/_expo dist/expo
  sed -i 's|/_expo/|/expo/|g' dist/index.html dist/404.html
fi

# Normalize any leftover root base paths to the isolated Pix Bible mount.
sed -i 's|href="/CV/favicon|href="/CV/pixbible/favicon|g' dist/index.html dist/404.html || true
sed -i 's|src="/CV/expo/|src="/CV/pixbible/expo/|g' dist/index.html dist/404.html || true
sed -i 's|src="/CV/_expo/|src="/CV/pixbible/expo/|g' dist/index.html dist/404.html || true

# Ensure Poppins (Through the Word–matched UI font) loads on static hosting.
inject_poppins() {
  local file="$1"
  if ! grep -q "fonts.googleapis.com/css2?family=Poppins" "$file"; then
    sed -i 's|<head>|<head>\n    <link rel="preconnect" href="https://fonts.googleapis.com" />\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700\&display=swap" rel="stylesheet" />|' "$file"
  fi
  # Keep product title consistent if another project overwrote export metadata.
  sed -i 's|<title>FitLife AI Coach</title>|<title>Pix Bible</title>|' "$file"
}

inject_poppins dist/index.html
inject_poppins dist/404.html
