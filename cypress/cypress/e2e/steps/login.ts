/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-relative-parent-imports */
import 'cypress-network-idle'
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I navigate to page {string}', (page: string) => {
  cy.visit(page)
})

When('I submit the credentials {string} {string}', (username: string, password: string) => {
  cy.waitForNetworkIdle(5000)
  cy.get('input[name="uidField"]').type(username)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()

})

Then('I am on the {string} page', (page: string) => {
  cy.waitForNetworkIdle(5000)
  cy.contains('div.pf-c-page__header-tools > div:nth-child(1) > div.pf-c-page__header-tools-item', 'akadmin')
})
