class UserEmailSite {
  emailInbox: string = '#message-page'
  emailList: string = `${this.emailInbox} > .list-group`
  email: string = 'a.message'
  emailHtmlPreview: string = '#preview-html'
}

export const userEmailSite = new UserEmailSite()
