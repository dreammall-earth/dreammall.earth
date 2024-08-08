class SignupPage {
  usernameInput: string = 'input[name="username"]'
  nameInput: string = 'input[name="name"]'
  emailInput: string = 'input[name="email"]'
  passwordInput: string = 'input[name="password"]'
  passwordRepeatInput: string = 'input[name="password_repeat"]'
  submitBtn: string = 'button[type="submit"]'

  usernameFieldIsVisible() {
    cy.get(this.usernameInput)
  }

  submitFormWith(username: string, name: string, email: string, password: string) {
    cy.get(this.usernameInput).type(username)
    cy.get(this.nameInput).type(name)
    cy.get(this.emailInput).type(email)
    cy.get(this.passwordInput).type(password)
    cy.get(this.passwordRepeatInput).type(password)
    cy.get(this.submitBtn).click()
  }
}

export const signupPage = new SignupPage()
