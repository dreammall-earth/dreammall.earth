import { type Page } from '@playwright/test'

export class WorldcafePage {
  readonly page: Page
  readonly userMenuBtn
  readonly signOutBtn
  readonly centerBtn
  readonly newTableBtnBtn

  constructor(page: Page) {
    this.page = page;
    this.userMenuBtn = page.locator('.user-info')
    this.signOutBtn = page.locator('.sign-out')
    this.centerBtn = page.locator('#dream-mall-button')
    this.newTableBtnBtn = page.locator('div.button-list > button.new-table-button')
  }

  async signoutButtonIsVisible() {
    return await this.userMenuBtn.waitFor({state:'visible'})
  }

  async logout() {
    await this.userMenuBtn.first().click()
    await this.signOutBtn.click()
  }

  // async enterMyTable() {
  //   cy.intercept('POST', Cypress.env('backendURL'), (req) => {
  //     if (req.body.hasOwnProperty('query') && req.body.query.includes('joinMyTable')) {
  //       req.alias = 'postJoinMyTableQuery'
  //     }
  //   })

  //   await this.centerBtn.click()
  //   await this.newTableBtnBtn.click()
  // }
}