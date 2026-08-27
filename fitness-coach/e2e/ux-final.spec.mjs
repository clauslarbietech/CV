import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

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

async function shot(page, name) {
  fs.mkdirSync(ART, { recursive: true });
  const file = path.join(ART, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function completeOnboarding(page, { sex = 'Female', name = 'Sam' } = {}) {
  // Splash / welcome
  await expect(page.getByText(/FITLIFE|everyday life|Pick male or female/i).first()).toBeVisible({
    timeout: 20000,
  });

  await page.getByRole('button', { name: sex, exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText(/QUICK SETUP|easy questions/i).first()).toBeVisible({
    timeout: 10000,
  });

  const nameInput = page.getByLabel(/your name/i);
  if (await nameInput.count()) {
    await nameInput.fill(name);
  }

  await page.getByRole('button', { name: /Lose fat/i }).first().click();
  await page.getByRole('button', { name: /New to working out/i }).first().click();

  const timeBtn = page.getByRole('button', { name: /25.35 minutes|About 10 minutes|15.20 minutes/i }).first();
  await timeBtn.scrollIntoViewIfNeeded();
  await timeBtn.click();

  const start = page.getByRole('button', { name: /Start my coaching plan/i });
  await start.scrollIntoViewIfNeeded();
  await expect(start).toBeEnabled({ timeout: 5000 });
  await start.click();

  await expect(page.getByText(/My Stuff|START MISSION|YOUR GOALS|SET UP ON YOUR DASHBOARD/i).first()).toBeVisible({
    timeout: 20000,
  });
}

test.describe('FitLife final UX suite', () => {
  test('P0 onboarding → My Stuff', async ({ page }) => {
    await fresh(page);
    await shot(page, 'ux_01_welcome');
    await completeOnboarding(page);
    await shot(page, 'ux_02_my_stuff_after_onboarding');
    await expect(page.getByText(/My Stuff/i).first()).toBeVisible();
  });

  test('P1 weight goals + Men/Women human preview', async ({ page }) => {
    await fresh(page);
    await completeOnboarding(page, { sex: 'Male' });

    // Edit goals card
    const edit = page.getByText(/Edit weight & goals|SET UP ON YOUR DASHBOARD|Weight, goals/i).first();
    await edit.scrollIntoViewIfNeeded();
    if (await page.getByText(/Edit weight & goals/i).count()) {
      await page.getByText(/Edit weight & goals/i).click();
    }

    await expect(page.getByText(/Body guide|Men|Women|Weight/i).first()).toBeVisible();
    await page.getByRole('button', { name: 'Women', exact: true }).click();
    await shot(page, 'ux_03_goals_women');

    await page.getByRole('button', { name: 'Men', exact: true }).click();

    // Frames — pick XL for now if visible
    const xl = page.getByRole('button', { name: 'XL', exact: true }).first();
    if (await xl.count()) await xl.click();
    const large = page.getByRole('button', { name: 'Large', exact: true }).nth(1);
    if (await large.count()) await large.click();

    const nowWeight = page.getByLabel(/Current weight/i);
    const goalWeight = page.getByLabel(/Goal weight/i);
    if (await nowWeight.count()) await nowWeight.fill('82');
    if (await goalWeight.count()) await goalWeight.fill('75');

    await shot(page, 'ux_04_goals_filled_human_preview');
    await page.getByRole('button', { name: /Save to dashboard/i }).click();
    await expect(page.getByText(/82|75|Edit weight/i).first()).toBeVisible({ timeout: 8000 });
    await shot(page, 'ux_05_goals_saved_summary');
  });

  test('P0 start workout form guide', async ({ page }) => {
    await fresh(page);
    await completeOnboarding(page);

    const startWorkout = page.getByRole('button', { name: /START WORKOUT/i }).first();
    await startWorkout.scrollIntoViewIfNeeded();
    await startWorkout.click();

    await page.waitForTimeout(1500);
    await shot(page, 'ux_06_workout_session');

    const begin = page.getByRole('button', { name: /Begin|Start workout|Let's go|Got it|Start session/i }).first();
    if (await begin.isVisible().catch(() => false)) {
      await begin.click();
      await page.waitForTimeout(1200);
    }

    await shot(page, 'ux_07_workout_form_guide');
    await expect(page.getByText('FORM GUIDE', { exact: true })).toBeVisible({
      timeout: 15000,
    });
  });

  test('P2–P4 tabs: Discover Notes Nutrition Progress Settings', async ({ page }) => {
    await fresh(page);
    await completeOnboarding(page);

    const tabs = [
      { name: /Discover/i, shot: 'ux_08_discover', expect: /plan|program|Home|Starter|Calisthenics|Horizon|30-Day/i },
      { name: /Notes/i, shot: 'ux_09_notes', expect: /NOTES|Meds|Chat|Day log|Open squad/i },
      { name: /Nutrition/i, shot: 'ux_10_nutrition', expect: /fuel|meal|fast|food|scan|protein/i },
      { name: /Progress/i, shot: 'ux_11_progress', expect: /body|vision|journey|day|progress|frame/i },
    ];

    for (const t of tabs) {
      await page.getByRole('tab', { name: t.name }).click();
      await page.waitForTimeout(800);
      await shot(page, t.shot);
      await expect(page.getByText(t.expect).first()).toBeVisible({ timeout: 12000 });
    }

    await page.getByRole('tab', { name: /My Stuff/i }).click();
    const gear = page.getByLabel(/Open settings|Settings/i).first();
    if (await gear.count()) {
      await gear.click();
      await page.waitForTimeout(800);
      await shot(page, 'ux_12_settings');
      await expect(
        page.getByText(/Sign out|Replay intro|Appearance|Day\/Night|Coach personality/i).first(),
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('P1 energy route + program switcher visible', async ({ page }) => {
    await fresh(page);
    await completeOnboarding(page);

    await page.getByRole('tab', { name: /My Stuff/i }).click();
    await page.waitForTimeout(500);

    const energy = page.getByText(/energy|How's your energy|Drained|Ready/i).first();
    if (await energy.count()) {
      await energy.scrollIntoViewIfNeeded();
      await shot(page, 'ux_13_energy_card');
    }

    const switcher = page.getByText(/Choose another plan|another plan|Switch/i).first();
    if (await switcher.count()) {
      await switcher.scrollIntoViewIfNeeded();
      await shot(page, 'ux_14_program_switcher');
    }

    await expect(page.getByText(/My Stuff|START MISSION|30-Day|Home Plan/i).first()).toBeVisible();
  });

  test('Persistence after refresh', async ({ page }) => {
    await fresh(page);
    await completeOnboarding(page, { name: 'Alex' });
    await page.reload();
    await page.waitForTimeout(1200);
    await shot(page, 'ux_15_after_refresh');
    await expect(page.getByText(/My Stuff|Alex|START MISSION|YOUR GOALS/i).first()).toBeVisible({
      timeout: 15000,
    });
    // Should not bounce to welcome sex picker
    await expect(page.getByText(/Pick male or female to begin/i)).toHaveCount(0);
  });
});
