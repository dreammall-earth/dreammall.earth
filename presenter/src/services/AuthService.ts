import { UserManager } from 'oidc-client-ts'

import { AUTH } from '#src/env'

export default class AuthService {
  userManager: UserManager
  constructor() {
    this.userManager = new UserManager({
      authority: AUTH.AUTHORITY,
      client_id: AUTH.CLIENT_ID,
      redirect_uri: AUTH.REDIRECT_URI,
      silent_redirect_uri: AUTH.SILENT_REDIRECT_URI,
      post_logout_redirect_uri: AUTH.POST_LOGOUT_REDIRECT_URI,
      response_type: AUTH.RESPONSE_TYPE,
      scope: AUTH.SCOPE,
      // userStore: new WebStorageStateStore(),
      loadUserInfo: true,
    })
  }

  public signUp() {
    window.location.href = AUTH.AUTHORITY_SIGNUP_URI
  }

  public signIn() {
    return this.userManager.signinRedirect()
  }

  public signInCallback() {
    return this.userManager.signinCallback()
  }

  public renewToken() {
    return this.userManager.signinSilentCallback()
  }

  public signOut() {
    return this.userManager.signoutRedirect()
  }

  public getUser() {
    return this.userManager.getUser()
  }
}
