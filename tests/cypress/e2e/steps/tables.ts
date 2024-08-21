import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

// eslint-disable-next-line import/no-relative-parent-imports
import { worldcafePage } from '../pages/WorldcafePage'

When('I click the enter my table button', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  worldcafePage.enterMyTable()
})

Then('My table is queried', () => {
  cy.wait('@postJoinMyTableQuery')
})
