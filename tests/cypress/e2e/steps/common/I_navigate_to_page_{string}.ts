// eslint-disable-next-line import/no-unassigned-import
import 'cypress-network-idle'
import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('I navigate to page {string}', (page: string) => {
  switch (page) {
    case 'authentik':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      cy.visit(Cypress.env('authentikURL'))
      break
    case 'signup':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      cy.visit(`${Cypress.env('authentikURL')}if/flow/dreammallearth-enrollment/`)
      break
    default:
      cy.visit(page)
  }
  cy.waitForNetworkIdle(5000)
})
