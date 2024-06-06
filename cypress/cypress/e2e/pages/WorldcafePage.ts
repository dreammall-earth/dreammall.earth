class WorldcafePage {
  userMenuBtn: string = '[data-test="user-dropdown"]'

  signoutButtonIsVisible() {
    cy.get(this.userMenuBtn).should('be.visible')
  }
}

export const worldcafePage = new WorldcafePage()
