import { config } from '@vue/test-utils'
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
import { UserManager } from 'oidc-client-ts'
import { vi } from 'vitest'

import AuthService from '#app/services/AuthService'

import type { PageContext } from 'vike/types'

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

const AUTH = {
  AUTHORITY: 'authority',
  AUTHORITY_SIGNUP_URI: 'authority_signup_uri',
  AUTHORITY_SIGNOUT_URI: 'authority_signout_uri',
  CLIENT_ID: 'client_id',
  REDIRECT_URI: 'redirect_uri',
  SILENT_REDIRECT_URI: 'silent_redirect_uri',
  RESPONSE_TYPE: 'response_type',
  SCOPE: 'scope',
} satisfies PageContext['publicEnv']['AUTH']

export const authService = new AuthService(AUTH)

config.global.provide = {
  ...config.global.provide,
  authService,
}
