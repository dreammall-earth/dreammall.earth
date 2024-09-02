import { defineConfig } from '@playwright/test'
import { cucumberReporter, defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'steps/**/*.ts',
  verbose: true
});

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  testDir,
  reporter: [
    cucumberReporter('html', { outputFile: `reports/report.html` }),
  ],
});