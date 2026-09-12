/**
 * Capture FitLife Shorts UI screenshots for walkthrough artifacts.
 */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ART = '/opt/cursor/artifacts';

async function fresh(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto('/');
  await page.waitForTimeout(800);
}

async function completeOnboarding(page) {
  await expect(
    page.getByText(/FITLIFE|Pick male or female|everyday life/i).first(),
  ).toBeVisible({ timeout: 25000 });

  await page.getByRole('button', { name: /^Male$/i }).click();
  await page.getByRole('button', { name: /^Continue$/i }).click();

  await expect(page.getByText(/QUICK SETUP|easy questions|your name/i).first()).toBeVisible({
    timeout: 15000,
  });

  const nameInput = page.getByLabel(/your name/i);
  if (await nameInput.count()) {
    await nameInput.fill('Alex');
  } else {
    const placeholder = page.getByPlaceholder(/name/i);
    if (await placeholder.count()) await placeholder.fill('Alex');
  }

  // Web Choice buttons expose "label + hint" as the accessible name
  for (const label of [
    /Lose fat/i,
    /New to working out/i,
    /25.?35 minutes/i,
  ]) {
    const btn = page.getByRole('button', { name: label }).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(200);
  }

  await page
    .getByRole('checkbox', { name: /Accept health and safety terms/i })
    .click();

  const start = page.getByRole('button', { name: /Start my coaching plan/i });
  await start.scrollIntoViewIfNeeded();
  await expect(start).toBeEnabled({ timeout: 8000 });
  await start.click();

  await expect(
    page.getByText(/My Stuff|Today|START MISSION|YOUR GOALS|SET UP ON YOUR DASHBOARD/i).first(),
  ).toBeVisible({ timeout: 25000 });
}

test('capture Shorts preview + fullscreen', async ({ page }) => {
  fs.mkdirSync(ART, { recursive: true });
  await fresh(page);
  await completeOnboarding(page);

  // Scroll Today until SHORT badge appears
  let found = false;
  for (let i = 0; i < 16; i++) {
    const short = page.getByText('SHORT', { exact: true }).first();
    if (await short.isVisible().catch(() => false)) {
      found = true;
      await short.scrollIntoViewIfNeeded();
      break;
    }
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(250);
  }

  await page.screenshot({
    path: path.join(ART, 'shorts_today_preview.png'),
    fullPage: false,
  });

  expect(found).toBeTruthy();

  // Open fullscreen shorts (card is pressable)
  await page.getByText('SHORT', { exact: true }).first().click();
  await page.waitForTimeout(1200);

  await page.screenshot({
    path: path.join(ART, 'shorts_fullscreen_player.png'),
    fullPage: false,
  });

  await expect(page.getByText(/WORKOUT SHORT/i).first()).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByRole('button', { name: /Start this workout/i })).toBeVisible();
});
