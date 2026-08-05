#!/usr/bin/env bash
set -euo pipefail

# GitHub Pages runs Jekyll by default and ignores paths like _expo unless .nojekyll exists.
touch dist/.nojekyll
cp dist/index.html dist/404.html
