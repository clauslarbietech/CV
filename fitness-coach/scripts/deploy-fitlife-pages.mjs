#!/usr/bin/env node
/**
 * Publishes fitness-coach web export to gh-pages under /fitlife only.
 * Does NOT wipe Pix Bible (root or /pixbible).
 *
 * Run from fitness-coach:
 *   EXPO_PUBLIC_BASE_URL=/CV/fitlife npm run export:web
 *   node scripts/deploy-fitlife-pages.mjs
 */
import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  copyFileSync,
  renameSync,
  readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const repoRoot = join(process.cwd(), '..');
const dist = join(process.cwd(), 'dist');
const PREVIEW = 'https://clauslarbietech.github.io/CV/fitlife/';

/**
 * GitHub project Pages only uses the ROOT 404.html (Pix Bible here).
 * So /CV/fitlife/welcome would fall through to Pix Bible unless we
 * pre-write a real fitlife/welcome/index.html SPA shell.
 */
const SPA_ROUTES = [
  'welcome',
  'today',
  'workouts',
  'nutrition',
  'progress',
  'notes',
  'coach',
  'profile',
  'program',
  'program/operation-iron-14',
  'program/operation-iron-30',
  'program/operation-long-train',
  'session',
  'session/operation-iron-14',
  'session/operation-iron-30',
  'session/operation-long-train',
  'legal/privacy',
  'legal/terms',
];

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Missing dist/index.html. Run export with EXPO_PUBLIC_BASE_URL=/CV/fitlife first.');
  process.exit(1);
}

copyFileSync(join(dist, 'index.html'), join(dist, '404.html'));
writeFileSync(join(dist, '.nojekyll'), '');

// GitHub Pages can ignore folders starting with "_"
const expoDir = join(dist, '_expo');
if (existsSync(expoDir)) {
  const target = join(dist, 'expo');
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  renameSync(expoDir, target);
  for (const file of ['index.html', '404.html']) {
    const path = join(dist, file);
    if (!existsSync(path)) continue;
    const html = readFileSync(path, 'utf8').replaceAll('/_expo/', '/expo/');
    writeFileSync(path, html);
  }
}

const shellHtml = readFileSync(join(dist, 'index.html'), 'utf8');
for (const route of SPA_ROUTES) {
  const out = join(dist, route, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, shellHtml);
}
console.log(`Wrote ${SPA_ROUTES.length} SPA route shells under dist/`);

const legalSrc = join(process.cwd(), 'legal');
if (existsSync(legalSrc)) {
  cpSync(legalSrc, join(dist, 'legal'), { recursive: true });
  console.log('Copied legal/ static pages to dist/legal/');
}

const worktree = mkdtempSync(join(tmpdir(), 'fitlife-gh-pages-'));

try {
  execSync(`git fetch origin gh-pages`, { cwd: repoRoot, stdio: 'inherit' });
  execSync(`git worktree add --detach "${worktree}" origin/gh-pages`, {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  execSync(`git checkout -B gh-pages`, { cwd: worktree, stdio: 'inherit' });

  const fitlifeDir = join(worktree, 'fitlife');
  rmSync(fitlifeDir, { recursive: true, force: true });
  cpSync(dist, fitlifeDir, { recursive: true });

  execSync(`git add -A`, { cwd: worktree, stdio: 'inherit' });
  execSync(
    `git -c user.email="cursor-agent@users.noreply.github.com" -c user.name="Cursor Agent" commit --allow-empty -m "Deploy FitLife gym preview to /fitlife"`,
    { cwd: worktree, stdio: 'inherit' },
  );
  execSync(`git push origin gh-pages`, { cwd: worktree, stdio: 'inherit' });
  console.log(`\nGym preview (does not overwrite Bible): ${PREVIEW}`);
} finally {
  try {
    execSync(`git worktree remove "${worktree}" --force`, {
      cwd: repoRoot,
      stdio: 'inherit',
    });
  } catch {
    rmSync(worktree, { recursive: true, force: true });
  }
}
