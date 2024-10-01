import { vi } from 'vitest'

import AuthService from '#src/services/AuthService'

export const userManager = {
  signinSilentCallback: vi.fn(),
  signinRedirect: vi.fn(),
  signinCallback: vi.fn(),
  getUser: vi.fn(),
  events: {
    addUserLoaded: vi.fn(),
    addUserUnloaded: vi.fn(),
  },
} satisfies ConstructorParameters<typeof AuthService>[0]['userManager']

const AUTH = {
  AUTHORITY_SIGNUP_URI: 'authority_signup_uri',
  AUTHORITY_SIGNOUT_URI: 'authority_signout_uri',
} satisfies ConstructorParameters<typeof AuthService>[0]['AUTH']

export const authService = new AuthService({ AUTH, userManager })
