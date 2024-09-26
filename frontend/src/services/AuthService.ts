import { UserManager } from 'oidc-client-ts'

import { useAuthStore } from '#stores/authStore.js'

import type { PageContext } from 'vike/types'

export default class AuthService {
  userManager: UserManager
  AUTH: PageContext['publicEnv']['AUTH']
  constructor(AUTH: PageContext['publicEnv']['AUTH']) {
    this.AUTH = AUTH
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
    window.location.href = this.AUTH.AUTHORITY_SIGNUP_URI
  }

  public signIn(pathname = '/') {
    return this.userManager.signinRedirect({
      // State is sent back to the client after successfull login.
      state: {
        redirectTo: pathname,
      },
    })
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
    window.location.href = this.AUTH.AUTHORITY_SIGNOUT_URI
  }

  public getUser() {
    return this.userManager.getUser()
  }
}
