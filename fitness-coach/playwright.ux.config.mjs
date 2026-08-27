/**
 * Final UX smoke suite for FitLife web export (pre–App Store readiness).
 * Run: npx playwright test --config=playwright.ux.config.mjs
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.FITLIFE_BASE_URL || 'http://127.0.0.1:35565',
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
    ...devices['iPhone 13'],
  },
  projects: [{ name: 'mobile-chrome', use: { ...devices['iPhone 13'] } }],
});
