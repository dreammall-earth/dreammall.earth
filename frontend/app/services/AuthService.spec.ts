import { UserManager } from 'oidc-client-ts'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import AuthService from '#app/services/AuthService'
import { useAuthStore } from '#app/stores/authStore'
import {
  signinSilentCallbackMock,
  signinRedirectMock,
  signinCallbackMock,
  getUserMock,
} from '#tests/mock.authService'

import type { PageContext } from 'vike/types'

const authStore = useAuthStore()

const AUTH = {
  AUTHORITY: 'authority',
  AUTHORITY_SIGNUP_URI: 'https://host/authority_signup_uri',
  AUTHORITY_SIGNOUT_URI: 'https://host/authority_signout_uri',
  CLIENT_ID: 'client_id',
  REDIRECT_URI: 'redirect_uri',
  SILENT_REDIRECT_URI: 'silent_redirect_uri',
  RESPONSE_TYPE: 'response_type',
  SCOPE: 'scope',
} satisfies PageContext['publicEnv']['AUTH']

const authService = new AuthService(AUTH)

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
      expect(global.window.location.href).toBe('https://host/authority_signup_uri')
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
      expect(global.window.location.href).toBe('https://host/authority_signout_uri')
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
