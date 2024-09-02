import { test, expect } from '@playwright/test'
import { When, Then } from './fixtures'

import { AuthentikPage } from '../pages/AuthentikPage'
import { LoginPage } from '../pages/LoginPage'
import { PresenterPage } from '../pages/PresenterPage'
import { WorldcafePage } from '../pages/WorldcafePage'

When('I submit the credentials {string} {string}', async ({ page }, username: string, password: string) => {
  const loginPage = new LoginPage(page)
  await loginPage.usernameFieldIsVisible()
  await loginPage.submitCredentials(username, password)
  test.setTimeout(45000)
})

Then('I am on page {string}', async ({ page }, pageName: string) => {
  const authentikPage = new AuthentikPage(page)
  const presenterPage = new PresenterPage(page)
  const worldcafePage = new WorldcafePage(page)

  // cy.waitForNetworkIdle(5000)
  // TODO wait for network o be idle
  test.setTimeout(45000)
  switch (pageName) {
    case 'authentik welcome':
      // expect(authentikPage.userNameIsVisible('akadmin')).toBe(true)
      authentikPage.userNameIsVisible('akadmin')
      break
    case 'presenter':
      expect(presenterPage.signinButtonIsVisible()).toBe(true)
      break
    case 'worldcafe':
      expect(worldcafePage.signoutButtonIsVisible()).toBe(true)
      break
    default:
      // cy.log(`Page '${page}' is not covered in step 'I am on page {string}'`)
  }
})
