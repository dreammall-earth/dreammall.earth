/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable import/no-relative-parent-imports */
// eslint-disable-next-line import/no-unassigned-import
import 'cypress-network-idle'
import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

import { authentikPage } from '../pages/AuthentikPage'
import { loginPage } from '../pages/LoginPage'
import { presenterPage } from '../pages/PresenterPage'
import { worldcafePage } from '../pages/WorldcafePage'

When('I submit the credentials {string} {string}', (username: string, password: string) => {
  loginPage.submitCredentials(username, password)
})

When('I confirm the consent agreement', () => {
  cy.waitForNetworkIdle(2000)
  loginPage.agreeConsent()
})

Then('I am on the worldcafe page', () => {
  cy.waitForNetworkIdle(10000)
  worldcafePage.signoutButtonIsVisible()
})

Then('I am on page {string}', (page: string) => {
  cy.waitForNetworkIdle(5000)
  switch (page) {
    case 'authentik welcome':
      authentikPage.userNameIsVisible('akadmin')
      break
    case 'presenter':
      presenterPage.signinButtonIsVisible()
      break
    case 'worldcafe':
      worldcafePage.signoutButtonIsVisible()
      break
    default:
      cy.log(`Page '${page}' is not covered in step 'I am on page {string}'`)
  }
})
