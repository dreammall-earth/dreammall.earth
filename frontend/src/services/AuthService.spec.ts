import { UserManager } from 'oidc-client-ts'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'
import {
  authService,
  signinSilentCallbackMock,
  signinRedirectMock,
  signinCallbackMock,
  getUserMock,
} from '#tests/mock.authService'

AUTH.AUTHORITY_SIGNUP_URI = 'https://host/SOME_SIGNUP_URI'

const authStore = useAuthStore()

describe('AuthService', () => {
  describe('constructor', () => {
    it('creates user manager', () => {
      expect(UserManager).toHaveBeenCalledWith({
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
      expect(signinRedirectMock).toHaveBeenCalledWith()
    })
  })

  describe('signInCallback', () => {
    it('calls signin callback', async () => {
      await authService.signInCallback()
      expect(signinCallbackMock).toHaveBeenCalledWith()
    })
  })

  describe('renewToken', () => {
    it('calls renew token', async () => {
      await authService.renewToken()
      expect(signinSilentCallbackMock).toHaveBeenCalledWith()
    })
  })

  describe('signOut', () => {
    const authSpy = vi.spyOn(authStore, 'clear')

    beforeEach(() => {
      vi.clearAllMocks()
      authService.signOut()
    })

    it('redirects to signout URI', () => {
      expect(global.window.location.href).toBe(AUTH.AUTHORITY_SIGNOUT_URI)
    })

    it('calls auth store clear', () => {
      expect(authSpy).toHaveBeenCalledWith()
    })
  })

  describe('getUser', () => {
    it('calls get user', async () => {
      await authService.getUser()
      expect(getUserMock).toHaveBeenCalledWith()
    })
  })
})
