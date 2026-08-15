# Transfer to Dyslexia-support-app

Target: https://github.com/clauslarbietech/Dyslexia-support-app

## Status

Prepared commit is ready but **push was denied** (Cloud Agent only has write access to `clauslarbietech/CV`).

Prepared artifacts (this workspace):
- `.transfer/dyslexia-support-app-hero.bundle` — git bundle with branch `cursor/place-hero-app-f899`
- `.transfer/hero-app-source.tar.gz` — source tarball (no node_modules)

## After write access is granted

```bash
git clone https://github.com/clauslarbietech/Dyslexia-support-app.git /tmp/dyslexia-app
cd /tmp/dyslexia-app
git fetch /path/to/dyslexia-support-app-hero.bundle cursor/place-hero-app-f899:cursor/place-hero-app-f899
git push -u origin cursor/place-hero-app-f899
# then open PR into main
```

Or extract the tarball onto a fresh clone of `main` and commit.

## Config changes for the new repo

- `next.config.ts` basePath/assetPrefix: `/Dyslexia-support-app` when `GITHUB_PAGES=1`
- `.github/workflows/deploy-pages.yml` added for static Pages deploy
- README updated for root-level `npm install` (no `cd lexrise`)
