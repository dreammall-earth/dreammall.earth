import { type Page } from '@playwright/test'

export class PresenterPage {
  readonly page: Page
  readonly signinBtn

  constructor(page: Page) {
    this.page = page;
    this.signinBtn = page.locator('button.sign-in')
  }

  async signinButtonIsVisible() {
    return await this.signinBtn.waitFor({state:'visible'})
  }
}