class PresenterPage {
  signinBtn: string = 'button.sign-in'

  signInButtonIsVisible() {
    cy.get(this.signinBtn).should('be.visible')
  }
}

export const presenterPage = new PresenterPage()
