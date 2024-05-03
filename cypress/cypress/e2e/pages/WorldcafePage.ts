class WorldcafePage {
  signoutBtn: string = 'span[href="/logout"]'

  signoutButtonIsVisible() {
    cy.get('button').contains('Sign Out')
  }
}

export const worldcafePage = new WorldcafePage()
