import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ART = '/opt/cursor/artifacts';

async function shot(page, name) {
  fs.mkdirSync(ART, { recursive: true });
  await page.screenshot({
    path: path.join(ART, `${name}.png`),
    fullPage: true,
  });
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

async function onboard(page, { goal, experience, name = 'Tester' } = {}) {
  await expect(
    page.getByText(/FITLIFE|everyday life|Pick male or female/i).first(),
  ).toBeVisible({ timeout: 20000 });

  await page.getByRole('button', { name: 'Male', exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText(/QUICK SETUP|easy questions/i).first()).toBeVisible();

  const nameInput = page.getByLabel(/your name/i);
  if (await nameInput.count()) await nameInput.fill(name);

  await page.getByRole('button', { name: goal }).first().click();
  await page.getByRole('button', { name: experience }).first().click();

  const timeBtn = page
    .getByRole('button', { name: /25.35 minutes|About 10 minutes|15.20 minutes/i })
    .first();
  await timeBtn.click();

  await page.getByRole('button', { name: /Start my coaching plan/i }).click();
  await expect(
    page.getByText(/My Stuff|START MISSION|YOUR GOALS|PICKED FOR YOU/i).first(),
  ).toBeVisible({ timeout: 20000 });
}

test.describe('Persona usability', () => {
  test('300 lb muscle-builder — Marcus', async ({ page }) => {
    await fresh(page);
    await onboard(page, {
      name: 'Marcus',
      goal: /Build muscle/i,
      experience: /Some experience/i,
    });
    await shot(page, 'persona_marcus_my_stuff');

    // Goals setup for ~300 lb (136 kg)
    await page.getByText(/Set up weight & goals/i).click();
    await page.getByLabel(/Current weight in kilograms/i).fill('136');
    await page.getByLabel(/Current weight in kilograms/i).blur();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: /Save to dashboard/i }).click();
    await expect(page.getByText(/136|300 lb|Build muscle/i).first()).toBeVisible({
      timeout: 8000,
    });
    await shot(page, 'persona_marcus_goals_saved');

    // Nutrition should speak to building, not shredding
    await page.getByRole('tab', { name: /Nutrition/i }).click();
    await page.waitForTimeout(600);
    await expect(page.getByText(/Fuel to Build/i).first()).toBeVisible();
    await expect(page.getByText(/Protein-forward/i).first()).toBeVisible();
    await shot(page, 'persona_marcus_nutrition');

    // Program fit — Long Train for intermediate muscle goal
    await page.getByRole('tab', { name: /My Stuff/i }).click();
    await expect(page.getByText(/Long Train|PICKED FOR YOU/i).first()).toBeVisible();
    await shot(page, 'persona_marcus_program_fit');
  });

  test('Advanced wall athlete — Alex', async ({ page }) => {
    await fresh(page);
    await onboard(page, {
      name: 'Alex',
      goal: /Build muscle/i,
      experience: /Train regularly/i,
    });
    await shot(page, 'persona_alex_my_stuff');

    await expect(page.getByText(/Bodyweight Basics|PICKED FOR YOU/i).first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(/Challenging|skills, strength/i).first()).toBeVisible();

    // Discover — calisthenics path visible
    await page.getByRole('tab', { name: /Discover/i }).click();
    await page.waitForTimeout(600);
    await expect(page.getByText(/Calisthenics|Bodyweight Basics/i).first()).toBeVisible();
    await shot(page, 'persona_alex_discover');

    // Start workout — challenging tier available on program detail
    await page.getByRole('tab', { name: /My Stuff/i }).click();
    const start = page.getByRole('button', { name: /START MISSION|START WORKOUT/i }).first();
    await start.scrollIntoViewIfNeeded();
    await start.click();
    await page.waitForTimeout(1500);
    await expect(
      page.getByRole('button', { name: /START MISSION|Begin|Start session/i }).first(),
    ).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/strength, control, and muscle/i).first()).toBeVisible();
    await shot(page, 'persona_alex_workout');
  });
});
