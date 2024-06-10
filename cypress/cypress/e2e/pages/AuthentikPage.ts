class AuthentikPage {
  usernameItem: string = 'div.pf-c-page__header-tools-item'

  userNameIsVisible(username: string) {
    cy.get(this.usernameItem).contains(username)
  }
}

export const authentikPage = new AuthentikPage()
