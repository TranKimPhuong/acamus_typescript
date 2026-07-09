import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://sis-qc.sis.flexiapp.cloud/',
    headless: false,
    // Open browser maximized and let Playwright inherit the full window size
    viewport: null,
    // --start-maximized bị Chromium bỏ qua khi có --window-position → set cứng size = độ phân giải màn hình phụ
    launchOptions: { args: ['--window-position=1920,0', '--window-size=1600,900'] },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {},
    },
  ],
});
