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
      loadUserInfo: true,
      
    })
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
    // return this.userManager.signoutRedirect()

    window.location.href = `http://localhost/if/flow/default-invalidation-flow/`

    // htis should be done in the redirect target
    // await this.userManager.removeUser()
    // await this.userManager.revokeTokens()

    // return this.userManager.signoutPopup()
    // return this.userManager.signoutSilent()
  }

  public getUser() {
    return this.userManager.getUser()
  }
}
