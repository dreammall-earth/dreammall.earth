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
    cy.get(this.centerBtn).click()
    cy.get(this.newTableBtnBtn).click()
  }
}

export const worldcafePage = new WorldcafePage()
