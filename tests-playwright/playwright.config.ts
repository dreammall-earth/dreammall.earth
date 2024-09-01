import { defineConfig } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'steps/**/*.ts',
  // ...other playwright-bdd options
});

export default defineConfig({
  testDir,
  // reporter: 'html',
});