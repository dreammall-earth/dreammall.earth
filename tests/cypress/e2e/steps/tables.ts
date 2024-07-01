import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

// eslint-disable-next-line import/no-relative-parent-imports
import { worldcafePage } from '../pages/WorldcafePage'

When('I click the enter my room button', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  worldcafePage.enterMyRoom()
})

Then('My room is queried', () => {
  cy.wait('@postJoinMyRoomQuery')
})
