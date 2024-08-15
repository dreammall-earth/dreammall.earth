 /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line import/no-unassigned-import
import 'cypress-network-idle'
import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

import { userEmailSite } from '../pages/UserEmailSite'

Then('an email transmission confirmation is displayed', () => {
  cy.waitForNetworkIdle(3000)
  cy.contains('Prüfen Sie Ihren Posteingang auf eine Bestätigungsmail')
})

Then('I receive an email containing the account confirmation link', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  cy.origin(`${Cypress.env('mailpitURL')}`, { args: { userEmailSite } }, ({ userEmailSite }) => {
    Cypress.on('uncaught:exception', () => {
      return false
    })

    cy.visit('/')
    cy.get(userEmailSite.emailInbox).should('be.visible')

    cy.get(userEmailSite.emailList)
      .find(userEmailSite.email)
      .not('.read')
      .filter(':contains("Account Confirmation")')
      .first()
      .click()

    cy.wait(4000)

    // eslint-disable-next-line cypress/no-assigning-return-values
    const emailIframe = cy
      .get(userEmailSite.emailHtmlPreview)
      .its('0.contentDocument.body')
      .should('be.visible')
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .then(cy.wrap)

    cy.wait(4000)
    emailIframe
      .find('#confirm')
      .should('have.attr', 'href')
      .then((href) => {
        cy.task('setEmailLink', href)
      })
  })
})

When('I open the account confirmation link in the browser', () => {
  cy.task('getEmailLink').then((emailLink) => {
    cy.visit(emailLink)
  })
  cy.waitForNetworkIdle(40000)
})
