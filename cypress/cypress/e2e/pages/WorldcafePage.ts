class WorldcafePage {
  userMenuBtn: string = '[data-test="user-menu-btn"]'

  signoutButtonIsVisible() {
    cy.get(this.userMenuBtn).should('be.visible')
  }
}

export const worldcafePage = new WorldcafePage()
