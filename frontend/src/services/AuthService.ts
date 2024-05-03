import { UserManager } from 'oidc-client-ts'

import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore.js'

export default class AuthService {
  userManager: UserManager
  constructor() {
    this.userManager = new UserManager({
      authority: AUTH.AUTHORITY,
      client_id: AUTH.CLIENT_ID,
      redirect_uri: AUTH.REDIRECT_URI,
      silent_redirect_uri: AUTH.SILENT_REDIRECT_URI,
      response_type: AUTH.RESPONSE_TYPE,
      scope: AUTH.SCOPE,
      loadUserInfo: true,
    })

    this.userManager.events.addUserLoaded(async () => {
      const auth = useAuthStore()
      auth.save(await this.userManager.getUser())
    })

    this.userManager.events.addUserUnloaded(() => {
      const auth = useAuthStore()
      auth.clear()
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
    const auth = useAuthStore()
    auth.clear()
    window.location.href = AUTH.AUTHORITY_SIGNOUT_URI
  }

  public getUser() {
    return this.userManager.getUser()
  }
}
