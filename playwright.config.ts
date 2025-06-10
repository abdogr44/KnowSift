import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  webServer: {
    command: 'pnpm --filter @knowsift/web dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
