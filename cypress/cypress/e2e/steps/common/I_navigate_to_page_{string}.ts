import 'cypress-network-idle'
import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('I navigate to page {string}', (page: string) => {
  if (page === 'authentik') {
    cy.visit(Cypress.env('authentikURL'))
  } else {
    cy.visit(page)
  }
  cy.waitForNetworkIdle(5000)
})