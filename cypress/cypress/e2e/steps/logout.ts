/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-relative-parent-imports */
import 'cypress-network-idle'
import { When } from '@badeball/cypress-cucumber-preprocessor'

import { authentikPage } from '../pages/AuthentikPage'
import { worldcafePage } from '../pages/WorldcafePage'

When('I log out from Authentik', () => {
  authentikPage.logout()
})

When('I log out from DreamMall', () => {
  worldcafePage.logout()
})
