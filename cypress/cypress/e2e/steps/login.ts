/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-relative-parent-imports */
import 'cypress-network-idle'
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

import { loginPage } from '../pages/LoginPage'
import { worldcafePage } from '../pages/WorldcafePage'

Given('I navigate to page {string}', (page: string) => {
  if (page === 'authentik') {
    cy.visit(Cypress.env('authentikURL'))
  } else {
    cy.visit(page)
  }
  cy.waitForNetworkIdle(5000)
})

When('I submit the credentials {string} {string}', (username: string, password: string) => {
  loginPage.submitCredentials(username, password)
})

When('I confirm the consent agreement', () => {
  cy.waitForNetworkIdle(2000)
  loginPage.agreeConsent()
})

Then('I am on the {string} page', (page: string) => {
  cy.waitForNetworkIdle(6000)
  cy.get('div.pf-c-page__header-tools-item').contains('akadmin')
})

Then('I am on the worldcafe page', () => {
  cy.waitForNetworkIdle(10000)
  worldcafePage.signoutButtonIsVisible()
})
