/// <reference types="cypress-network-idle" />
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-relative-parent-imports */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

import 'cypress-network-idle'
import { loginPage } from '../pages/LoginPage'
import { worldcafePage } from '../pages/WorldcafePage'

Given('The browser navigates to the login page', () => {
  cy.visit('/signin', { timeout: 30000 })
  cy.waitForNetworkIdle(10000)
  loginPage.usernameFieldIsVisible()
})

When('I submit the credentials {string} {string}', (username: string, password: string) => {
  loginPage.submitUsername(username)
  cy.waitForNetworkIdle(5000)
  loginPage.submitPassword(password)
})

Then('I am on the worldcafe page', () => {
  cy.waitForNetworkIdle(20000)
  worldcafePage.signoutButtonIsVisible()
})
