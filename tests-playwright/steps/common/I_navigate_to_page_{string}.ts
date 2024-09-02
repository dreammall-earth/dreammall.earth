import { test } from '@playwright/test'

import { Given } from '../fixtures'

Given('I navigate to page {string}', async ({ page }, pageName: string) => {
  if (pageName === 'authentik') {
    await page.goto('http://localhost:9000/')
  } else {
    await page.goto('/')
  }
  // TODO wait for network o be idle
  test.setTimeout(45000)
  //await page.waitForTimeout(50000)
  await page.waitForLoadState('networkidle')
})