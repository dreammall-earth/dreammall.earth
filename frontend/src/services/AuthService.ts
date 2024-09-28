import { useAuthStore } from '#stores/authStore.js'

import type { UserManager as ActualUserManager } from 'oidc-client-ts'
import type { PageContext } from 'vike/types'

export type UserManager = Pick<
  ActualUserManager,
  'signinRedirect' | 'signinSilentCallback' | 'signinCallback' | 'getUser'
> & { events: Pick<ActualUserManager['events'], 'addUserLoaded' | 'addUserUnloaded'> }

export default class AuthService {
  userManager: UserManager
  AUTH: Pick<PageContext['publicEnv']['AUTH'], 'AUTHORITY_SIGNUP_URI' | 'AUTHORITY_SIGNOUT_URI'>
  constructor({
    AUTH,
    userManager,
  }: {
    AUTH: Pick<PageContext['publicEnv']['AUTH'], 'AUTHORITY_SIGNUP_URI' | 'AUTHORITY_SIGNOUT_URI'>
    userManager: UserManager
  }) {
    this.userManager = userManager
    this.AUTH = AUTH

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
