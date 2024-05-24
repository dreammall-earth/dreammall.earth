/// <reference types="cypress-network-idle" />
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-relative-parent-imports */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

import 'cypress-network-idle'
import { loginPage } from '../pages/LoginPage'
import { worldcafePage } from '../pages/WorldcafePage'

Given('The browser navigates to the login page', () => {
  cy.visit('/signin')
  cy.waitForNetworkIdle(5000)
  loginPage.usernameFieldIsVisible()
})

When('I submit the credentials {string} {string}', (username: string, password: string) => {
  cy.origin(
    'http://localhost:9000/if/flow/dreammallearth-authentication-flow/',
    { args: { username, password } },
    ({ username, password }) => {
      // cy.on('uncaught:exception', (e) => {
      //   if (e.message.includes('JSON')) {
      //     // we expected this error, so let's ignore it
      //     // and let the test continue
      //     return false
      //   }
      // })
      // loginPage.submitUsername(username)
      cy.get('input[name="uidField"]').type(username)
      cy.get('input[name="password"]').type(password)
      cy.get('button[type="submit"]').click()
      cy.url({ timeout: 5000 }).should('include', 'authorization-implicit-consent')
      // loginPage.agreeConsent()
      cy.get('button[type="submit"]').click()
    },
  )
})

Then('I am on the worldcafe page', () => {
  cy.waitForNetworkIdle(10000)
  worldcafePage.signoutButtonIsVisible()
})
