/**
 * Relatii Stage 1 Match happy-path UI verification (Playwright).
 * Produces screenshots + a paced video under /opt/cursor/artifacts.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = process.env.RELATII_BASE_URL || 'http://127.0.0.1:8082';
const OUT = '/opt/cursor/artifacts';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickLabel(page, label) {
  const btn = page.getByRole('button', { name: label, exact: true }).first();
  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await btn.click();
}

async function clickCheckbox(page, label) {
  const btn = page.getByRole('checkbox', { name: label, exact: true }).first();
  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await btn.click();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    recordVideo: { dir: OUT, size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem(
      'relatii-theme',
      JSON.stringify({ state: { preference: 'night' }, version: 0 }),
    );
  });
  await page.goto(`${BASE}/welcome`, { waitUntil: 'networkidle' });
  await page.getByText('Relatii', { exact: true }).first().waitFor({ timeout: 20000 });
  await sleep(900);
  await page.screenshot({ path: path.join(OUT, 'relatii-01-welcome.png'), fullPage: true });

  await clickLabel(page, 'Start matching');
  await page.getByText('Tap 1 of 3').waitFor();
  await sleep(600);
  await clickCheckbox(page, 'Life partner');
  await sleep(400);
  await clickLabel(page, 'Continue');

  await page.getByText('Tap 2 of 3').waitFor();
  await sleep(500);
  await clickCheckbox(page, 'Maybe');
  await sleep(400);
  await clickLabel(page, 'Continue');

  await page.getByText('Tap 3 of 3').waitFor();
  await sleep(500);
  await clickCheckbox(page, 'Trust');
  await sleep(250);
  await clickCheckbox(page, 'Communication');
  await sleep(250);
  await clickCheckbox(page, 'Growth');
  await sleep(500);
  await page.screenshot({ path: path.join(OUT, 'relatii-02-tap3.png'), fullPage: true });
  await clickLabel(page, 'View provisional DNA');

  await page.getByText('Your DNA is forming').waitFor({ timeout: 15000 });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT, 'relatii-03-dna-preview.png'), fullPage: true });
  await clickLabel(page, 'Save my DNA');

  await page.getByText("Today’s curated set").waitFor({ timeout: 15000 });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT, 'relatii-04-discover.png'), fullPage: true });

  await page.getByLabel(/Maya,/).click();
  await page.getByText('Shared strengths').waitFor({ timeout: 15000 });
  await sleep(800);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(500);
  await page.screenshot({ path: path.join(OUT, 'relatii-05-why-align.png'), fullPage: true });
  await clickLabel(page, 'Connect');
  await sleep(400);
  await clickLabel(page, 'Back to Discover');
  await sleep(600);

  await page.getByText('Settings', { exact: true }).click();
  await sleep(600);
  await page.getByLabel('Theme Day').click();
  await sleep(700);
  await page.screenshot({ path: path.join(OUT, 'relatii-06-settings-day.png'), fullPage: true });
  await page.getByLabel('Theme Night').click();
  await sleep(700);

  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const raw = await video.path();
    const dest = path.join(OUT, 'relatii-match-flow.webm');
    fs.renameSync(raw, dest);
    console.log('VIDEO', dest);
  }

  console.log('OK screenshots written to', OUT);
})().catch((err) => {
  console.error('FAIL', err);
  process.exit(1);
});
