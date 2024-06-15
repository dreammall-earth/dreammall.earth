class WorldcafePage {
  userMenuBtn: string = '.user-info'
  signOutBtn: string = '.sign-out'

  signoutButtonIsVisible() {
    cy.get(this.userMenuBtn).should('be.visible')
  }

  logout() {
    cy.get(this.userMenuBtn).first().click()
    cy.get(this.signOutBtn).click()
  }
}

export const worldcafePage = new WorldcafePage()
