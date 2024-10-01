import 'cypress-network-idle'
import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

import { signupPage } from '../pages/SignupPage'

When('I submit the signup form with:', table => {
  table = table.rowsHash()
  signupPage.submitFormWith(table.username, table.name, table.email, table.password)
})