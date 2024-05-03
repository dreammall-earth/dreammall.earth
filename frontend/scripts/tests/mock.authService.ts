import { config } from '@vue/test-utils'
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
import { UserManager } from 'oidc-client-ts'
import { vi } from 'vitest'

import { AUTH } from '#src/env'
import AuthService from '#src/services/AuthService'

export const signinSilentCallbackMock = vi.fn()
export const signinRedirectMock = vi.fn()
export const signinCallbackMock = vi.fn()
export const signoutRedirectMock = vi.fn()
export const getUserMock = vi.fn()
export const addUserUnloadedMock = vi.fn()
export const addUserLoadedMock = vi.fn()

vi.mock('oidc-client-ts', async (importOriginal) => {
  const mod = await importOriginal<typeof import('oidc-client-ts')>()
  return {
    ...mod,
    UserManager: vi.fn().mockImplementation(() => {
      return {
        signinSilentCallback: signinSilentCallbackMock,
        signinRedirect: signinRedirectMock,
        signinCallback: signinCallbackMock,
        signoutRedirect: signoutRedirectMock,
        getUser: getUserMock,
        events: {
          addUserLoaded: addUserLoadedMock,
          addUserUnloaded: addUserUnloadedMock,
        },
      }
    }),
  }
})

AUTH.AUTHORITY = 'authority'
AUTH.CLIENT_ID = 'client_id'
AUTH.REDIRECT_URI = 'redirect_uri'
AUTH.SILENT_REDIRECT_URI = 'silent_redirect_uri'
AUTH.RESPONSE_TYPE = 'response_type'
AUTH.SCOPE = 'scope'

export const authService = new AuthService()

config.global.provide = {
  ...config.global.provide,
  authService,
}
