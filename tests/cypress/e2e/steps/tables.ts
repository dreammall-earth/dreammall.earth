import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

import { worldcafePage } from '../pages/WorldcafePage'

When('I click the enter my room button', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  worldcafePage.enterMyRoom()
})

Then('I am navigated to page where my room is queried', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  cy.intercept('POST', Cypress.env('backendURL'), (req) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-prototype-builtins, @typescript-eslint/no-unsafe-member-access
    if (req.body.hasOwnProperty('query') && req.body.query.includes('joinMyRoom')) {
      req.alias = 'postJoinMyRoomQuery'
    }
  })

  cy.wait('@postJoinMyRoomQuery')
})
