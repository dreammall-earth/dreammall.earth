class LoginPage {
  usernameInput: string = '#username'
  passwordInput: string = '#password'
  submitBtn: string = 'button[type=submit]'

  submitLogin(username: string, password: string) {
    cy.get(this.usernameInput).type(username)
    cy.get(this.passwordInput).type(password)
    cy.get(this.submitBtn).click()
  }
}

export const loginPage = new LoginPage()
