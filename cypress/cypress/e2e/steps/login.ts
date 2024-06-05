/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-relative-parent-imports */
import 'cypress-network-idle'
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

import { loginPage } from '../pages/LoginPage'

Given('I navigate to page {string}', (page: string) => {
  cy.visit(page)
})

When('I submit the credentials {string} {string}', (username: string, password: string) => {
  cy.waitForNetworkIdle(5000)
  loginPage.submitCredentials(username, password)
})

Then('I am on the {string} page', (page: string) => {
  cy.waitForNetworkIdle(8000)
  cy.get('div.pf-c-page__header-tools-item').contains('akadmin')
})
