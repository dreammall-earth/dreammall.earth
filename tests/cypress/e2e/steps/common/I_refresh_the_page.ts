import { When } from '@badeball/cypress-cucumber-preprocessor'

When('I refresh the page', () => {
  cy.reload(true)
})
