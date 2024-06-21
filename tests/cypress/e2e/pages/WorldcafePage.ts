class WorldcafePage {
  userMenuBtn: string = '.user-info'
  signOutBtn: string = '.sign-out'
  centerBtn: string = '#create-button'
  newTableBtnBtn: string = 'div.button-list > button.new-table-button'

  signoutButtonIsVisible() {
    cy.get(this.userMenuBtn).should('be.visible')
  }

  logout() {
    cy.get(this.userMenuBtn).first().click()
    cy.get(this.signOutBtn).click()
  }

  enterMyRoom() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    // cy.intercept('POST', Cypress.env('backendURL'), (req) => {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-prototype-builtins, @typescript-eslint/no-unsafe-member-access
    //   if (req.body.hasOwnProperty('query') && req.body.query.includes('joinMyRoom')) {
    //     req.alias = 'postJoinMyRoomQuery'
    //   }
    // })

    cy.get(this.centerBtn).click()
    cy.get(this.newTableBtnBtn).click()
    // cy.url().should('contain', '/room/')
    // cy.wait('@postJoinMyRoomQuery')
  }
}

export const worldcafePage = new WorldcafePage()
