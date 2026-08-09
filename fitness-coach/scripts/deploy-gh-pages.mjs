#!/usr/bin/env node
/**
 * Publishes fitness-coach/dist to the repo gh-pages branch.
 * Run from fitness-coach after `npm run export:web`.
 */
import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
  copyFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repoRoot = join(process.cwd(), '..');
const dist = join(process.cwd(), 'dist');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Missing dist/index.html. Run npm run export:web first.');
  process.exit(1);
}

copyFileSync(join(dist, 'index.html'), join(dist, '404.html'));
writeFileSync(join(dist, '.nojekyll'), '');

const worktree = mkdtempSync(join(tmpdir(), 'fitlife-gh-pages-'));

try {
  execSync(`git fetch origin gh-pages`, { cwd: repoRoot, stdio: 'inherit' });
  execSync(`git worktree add --detach "${worktree}" origin/gh-pages`, {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  execSync(`git checkout -B gh-pages`, { cwd: worktree, stdio: 'inherit' });
  execSync(`find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +`, {
    cwd: worktree,
    stdio: 'inherit',
    shell: '/bin/bash',
  });
  cpSync(dist, worktree, { recursive: true });
  execSync(`git add -A`, { cwd: worktree, stdio: 'inherit' });
  execSync(
    `git -c user.email="cursor-agent@users.noreply.github.com" -c user.name="Cursor Agent" commit --allow-empty -m "Deploy FitLife AI Coach web preview"`,
    { cwd: worktree, stdio: 'inherit' },
  );
  execSync(`git push origin gh-pages`, { cwd: worktree, stdio: 'inherit' });
  console.log('\nPreview: https://clauslarbietech.github.io/CV/');
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
