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
