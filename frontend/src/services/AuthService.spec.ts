import { UserManager } from 'oidc-client-ts'
import { describe, it, expect } from 'vitest'

import { AUTH } from '#src/env'
import {
  authService,
  signinSilentCallbackMock,
  signinRedirectMock,
  signinCallbackMock,
  getUserMock,
} from '#tests/mock.authService'

AUTH.AUTHORITY_SIGNUP_URI = 'https://host/SOME_SIGNUP_URI'

describe('AuthService', () => {
  describe('constructor', () => {
    it('creates user manager', () => {
      expect(UserManager).toBeCalledWith({
        authority: 'authority',
        client_id: 'client_id',
        redirect_uri: 'redirect_uri',
        silent_redirect_uri: 'silent_redirect_uri',
        response_type: 'response_type',
        scope: 'scope',
        loadUserInfo: true,
      })
    })
  })

  describe('signUp', () => {
    it('redirects to signup URI', () => {
      authService.signUp()
      expect(global.window.location.href).toBe(AUTH.AUTHORITY_SIGNUP_URI)
    })
  })

  describe('signIn', () => {
    it('calls signin redirect', async () => {
      await authService.signIn()
      expect(signinRedirectMock).toBeCalled()
    })
  })

  describe('signInCallback', () => {
    it('calls signin callback', async () => {
      await authService.signInCallback()
      expect(signinCallbackMock).toBeCalled()
    })
  })

  describe('renewToken', () => {
    it('calls renew token', async () => {
      await authService.renewToken()
      expect(signinSilentCallbackMock).toBeCalled()
    })
  })

  describe('signOut', () => {
    it('redirects to signout URI', () => {
      authService.signOut()
      expect(global.window.location.href).toBe(AUTH.AUTHORITY_SIGNOUT_URI)
    })
  })

  describe('getUser', () => {
    it('calls get user', async () => {
      await authService.getUser()
      expect(getUserMock).toBeCalled()
    })
  })
})
