class AuthentikPage {
  usernameItem: string = 'div.pf-c-page__header-tools-item'
  logoutBtn: string = '.fa-sign-out-alt'

  userNameIsVisible(username: string) {
    cy.get(this.usernameItem).contains(username)
  }

  logout() {
    cy.get(this.logoutBtn).click()
  }
}

export const authentikPage = new AuthentikPage()
