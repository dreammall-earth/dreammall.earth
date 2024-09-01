import { type Page } from '@playwright/test'

export class WelcomePage {
  readonly page: Page
  readonly successMessage
  readonly welcomeHeader
  readonly logoutBtn

  constructor(page: Page) {
    this.page = page;
    this.successMessage = page.locator('.flash.success')
    this.welcomeHeader = page.locator('.subheader')
    this.logoutBtn = page.locator('a[href="/logout"]')
  }
}