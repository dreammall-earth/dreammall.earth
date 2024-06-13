class PresenterPage {
  signinBtn: string = 'button.sign-in'

  signinButtonIsVisible() {
    cy.get(this.signinBtn).should('be.visible')
  }
}

export const presenterPage = new PresenterPage()
