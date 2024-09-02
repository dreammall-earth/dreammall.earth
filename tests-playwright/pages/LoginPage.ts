import { test, type Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly usernameInput
  readonly passwordInput
  readonly submitBtn

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="uidField"]')
    this.passwordInput = page.locator('input[name="password"]')
    this.submitBtn = page.locator('button[type="submit"]')
    test.setTimeout(45000)
  }

  async usernameFieldIsVisible() {
    await this.usernameInput.waitFor({state:'visible'})
  }

  async submitCredentials(username: string, password: string) {
    await this.usernameInput.type(username);
    await this.passwordInput.type(password)
    await this.submitBtn.click()
  }
}