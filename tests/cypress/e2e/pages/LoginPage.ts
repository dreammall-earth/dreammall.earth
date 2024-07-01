class LoginPage {
  usernameInput: string = 'input[name="uidField"]'
  passwordInput: string = 'input[name="password"]'
  submitBtn: string = 'button[type="submit"]'

  usernameFieldIsVisible() {
    cy.get(this.usernameInput)
  }

  submitCredentials(username: string, password: string) {
    cy.get(this.usernameInput).type(username)
    cy.get(this.passwordInput).type(password)
    cy.get(this.submitBtn).click()
  }

  agreeConsent() {
    cy.url().should('include', 'dreammallearth-authorization-implicit-consent')
    cy.get(this.submitBtn).click()
  }
}

export const loginPage = new LoginPage()
