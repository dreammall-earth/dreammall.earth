import { type Page } from '@playwright/test'

export class AuthentikPage {
  readonly page: Page
  readonly usernameItem
  readonly logoutBtn

  constructor(page: Page) {
    this.page = page;
    this.usernameItem = page.locator('div.pf-c-page__header-tools-item')
    this.logoutBtn = page.locator('.fa-sign-out-alt')
  }

  async userNameIsVisible(username: string) {
    // return await this.usernameItem.contains(username).waitFor({state:'visible'})
    return await this.usernameItem.waitFor({state:'visible'})
  }

  async logout() {
    await this.logoutBtn.click()
  }
}