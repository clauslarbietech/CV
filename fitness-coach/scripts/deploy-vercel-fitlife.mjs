#!/usr/bin/env node
/**
 * Deploys FitLife (fitness-coach) as its OWN Vercel project.
 * Does not reuse other apps' projects in this monorepo.
 *
 * Usage (from fitness-coach/):
 *   VERCEL_TOKEN=... node scripts/deploy-vercel-fitlife.mjs
 *   VERCEL_TOKEN=... npm run deploy:vercel:preview
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_NAME = 'fitlife-ai-coach';
const cwd = process.cwd();
const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error(
    'Missing VERCEL_TOKEN. Create one at https://vercel.com/account/tokens',
  );
  process.exit(1);
}

if (!existsSync(join(cwd, 'vercel.json'))) {
  console.error('Run this from fitness-coach/ (vercel.json missing).');
  process.exit(1);
}

const orgFlag = process.env.VERCEL_ORG_ID
  ? ` --scope ${process.env.VERCEL_ORG_ID}`
  : '';

const base = `npx vercel --token ${token}${orgFlag} --yes`;

console.log(`Linking/creating isolated Vercel project: ${PROJECT_NAME}`);
execSync(
  `${base} link --project ${PROJECT_NAME} --yes`,
  { stdio: 'inherit', cwd, env: process.env },
);

console.log('Deploying FitLife preview…');
const url = execSync(`${base} deploy --yes`, {
  encoding: 'utf8',
  cwd,
  env: process.env,
})
  .trim()
  .split('\n')
  .filter(Boolean)
  .pop();

console.log('\nFitLife preview URL:');
console.log(url);
