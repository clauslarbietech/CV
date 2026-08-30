import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ART = '/opt/cursor/artifacts';

async function shot(page, name) {
  fs.mkdirSync(ART, { recursive: true });
  await page.screenshot({ path: path.join(ART, `${name}.png`), fullPage: true });
}

async function fresh(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto('/');
  await page.waitForTimeout(1200);
}

async function onboard(page) {
  await expect(page.getByText(/FITLIFE|everyday life|Pick male or female/i).first()).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole('button', { name: 'Female', exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText(/QUICK SETUP|easy questions/i).first()).toBeVisible();
  await page.getByRole('button', { name: /Lose fat/i }).first().click();
  await page.getByRole('button', { name: /New to working out/i }).first().click();
  const timeBtn = page.getByRole('button', { name: /25.35 minutes|About 10 minutes|15.20 minutes/i }).first();
  await timeBtn.click();
  await page.getByText(/I understand this is not medical advice/i).click();
  await page.getByRole('button', { name: /Start my coaching plan/i }).click();
  await expect(page.getByText(/My Stuff|START MISSION|YOUR GOALS/i).first()).toBeVisible({
    timeout: 20000,
  });
}

test.describe('User journey audit', () => {
  test('Full section walkthrough with screenshots', async ({ page }) => {
    await fresh(page);
    await shot(page, 'audit_01_welcome');
    await onboard(page);
    await shot(page, 'audit_02_my_stuff');

    // Discover
    await page.getByRole('tab', { name: /Discover/i }).click();
    await page.waitForTimeout(800);
    await shot(page, 'audit_03_discover');
    await expect(page.getByText(/Pick a plan length|30-Day|Home Plan/i).first()).toBeVisible();

    // Notes + meds (sub-tabs)
    await page.getByRole('tab', { name: /Notes/i }).click();
    await page.waitForTimeout(800);
    await shot(page, 'audit_04_notes');
    await expect(page.getByText(/Take your meds|Morning|Evening/i).first()).toBeVisible();
    await page.getByRole('button', { name: 'Supplements', exact: true }).click();
    await page.getByPlaceholder(/Med or supplement name/i).fill('Vitamin D');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText('Vitamin D')).toBeVisible();
    await shot(page, 'audit_05_notes_med_added');

    // Settings via gear (header only — scroll up first)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByLabel(/Open settings/i).click();
    await page.waitForTimeout(800);
    await shot(page, 'audit_08_settings');
    await expect(page.getByText(/Appearance|Coach personality|Replay intro/i).first()).toBeVisible();
    await page.getByRole('link', { name: /back/i }).click();
    await page.waitForTimeout(400);

    // Nutrition
    await page.getByRole('tab', { name: /Nutrition/i }).click();
    await page.waitForTimeout(800);
    await shot(page, 'audit_06_nutrition');

    // Progress
    await page.getByRole('tab', { name: /Progress/i }).click();
    await page.waitForTimeout(800);
    await shot(page, 'audit_07_progress');
    await page.getByRole('tab', { name: /My Stuff/i }).click();
    const start = page.getByRole('button', { name: /START WORKOUT|START MISSION/i }).first();
    await start.scrollIntoViewIfNeeded();
    await start.click();
    await page.waitForTimeout(1500);
    await shot(page, 'audit_09_workout');
  });
});
