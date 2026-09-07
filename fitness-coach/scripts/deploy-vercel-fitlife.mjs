#!/usr/bin/env node
/**
 * Deploys FitLife (fitness-coach) as its OWN Vercel project.
 * Does not reuse other apps' projects in this monorepo.
 *
 * Usage (from fitness-coach/):
 *   VERCEL_TOKEN=... node scripts/deploy-vercel-fitlife.mjs
 *   VERCEL_TOKEN=... npm run deploy:vercel:preview
 *
 * Optional:
 *   VERCEL_ORG_ID=team_...  (defaults to FitLife team below)
 *   VERCEL_PROJECT_NAME=fitlife-ai-coach
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_NAME = process.env.VERCEL_PROJECT_NAME || 'fitlife-ai-coach';
/** clauslarbietech team (provided for FitLife usability deploys) */
const DEFAULT_ORG_ID = 'team_4jVk0fZp9WVkBUC2GTFazCAg';
const cwd = process.cwd();
const token = process.env.VERCEL_TOKEN;
const orgId = process.env.VERCEL_ORG_ID || DEFAULT_ORG_ID;

if (!token) {
  console.error(
    'Missing VERCEL_TOKEN. Create one at https://vercel.com/account/tokens\n' +
      'Then run:\n' +
      `  VERCEL_TOKEN=... VERCEL_ORG_ID=${orgId} npm run deploy:vercel:preview`,
  );
  process.exit(1);
}

if (!existsSync(join(cwd, 'vercel.json'))) {
  console.error('Run this from fitness-coach/ (vercel.json missing).');
  process.exit(1);
}

const vercelDir = join(cwd, '.vercel');
mkdirSync(vercelDir, { recursive: true });
writeFileSync(
  join(vercelDir, 'project.json'),
  JSON.stringify(
    {
      orgId,
      projectName: PROJECT_NAME,
      ...(process.env.VERCEL_PROJECT_ID
        ? { projectId: process.env.VERCEL_PROJECT_ID }
        : {}),
    },
    null,
    2,
  ),
);

const base = `npx vercel --token ${token} --scope ${orgId} --yes`;

console.log(`Linking/creating Vercel project: ${PROJECT_NAME} (scope ${orgId})`);
execSync(`${base} link --project ${PROJECT_NAME} --yes`, {
  stdio: 'inherit',
  cwd,
  env: process.env,
});

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
