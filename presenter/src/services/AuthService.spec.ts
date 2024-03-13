import { UserManager } from 'oidc-client-ts'
import { describe, it, expect } from 'vitest'

import {
  authService,
  signinSilentCallbackMock,
  signinRedirectMock,
  signinCallbackMock,
  signoutRedirectMock,
  getUserMock,
} from '#tests/mock.authService'

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

  // how to redirect correctly in vike?
  describe('signOut', () => {
    it.skip('calls signout redirect', () => {
      authService.signOut()
      expect(signoutRedirectMock).toBeCalled()
    })
  })

  describe('getUser', () => {
    it('calls get user', async () => {
      await authService.getUser()
      expect(getUserMock).toBeCalled()
    })
  })
})
