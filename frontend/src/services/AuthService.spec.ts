import { describe, it, expect, vi, beforeEach } from 'vitest'

import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'
import { userManager } from '#tests/mock.authService'

const authStore = useAuthStore()

const AUTH = {
  AUTHORITY_SIGNUP_URI: 'https://host/authority_signup_uri',
  AUTHORITY_SIGNOUT_URI: 'https://host/authority_signout_uri',
} satisfies ConstructorParameters<typeof AuthService>[0]['AUTH']

const authService = new AuthService({ userManager, AUTH })

describe('AuthService', () => {
  describe('signUp', () => {
    it('redirects to signup URI', () => {
      authService.signUp()
      expect(global.window.location.href).toBe('https://host/authority_signup_uri')
    })
  })

  describe('signIn', () => {
    it('calls signin redirect', async () => {
      await authService.signIn()
      expect(userManager.signinRedirect).toHaveBeenCalledWith({
        state: {
          redirectTo: '/',
        },
      })
    })

    it('calls signin redirect with path', async () => {
      await authService.signIn('/my-path')
      expect(userManager.signinRedirect).toHaveBeenCalledWith({
        state: {
          redirectTo: '/my-path',
        },
      })
    })
  })

  describe('signInCallback', () => {
    it('calls signin callback', async () => {
      await authService.signInCallback()
      expect(userManager.signinCallback).toHaveBeenCalledWith()
    })
  })

  describe('renewToken', () => {
    it('calls renew token', async () => {
      await authService.renewToken()
      expect(userManager.signinSilentCallback).toHaveBeenCalledWith()
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
      expect(userManager.getUser).toHaveBeenCalledWith()
    })
  })
})
