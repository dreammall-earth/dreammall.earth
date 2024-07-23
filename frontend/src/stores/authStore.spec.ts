import Cookies from 'js-cookie'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { cookieStorage, useAuthStore } from './authStore'

const setCookieSpy = vi.spyOn(Cookies, 'set')
const getCookieSpy = vi.spyOn(Cookies, 'get')

describe('Auth Store', () => {
  setActivePinia(createPinia())
  const authStore = useAuthStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(authStore.user).toBeNull()
      expect(authStore.accessToken).toBe('')
      expect(authStore.isLoggedIn).toBeFalsy()
    })
  })

  describe('save action', () => {
    it('updates the store', () => {
      authStore.save({
        access_token: 'access_token',
        profile: {
          aud: 'aud',
          sub: 'sub',
          exp: 1,
          iat: 1,
          iss: 'iss',
        },
        token_type: 'token_type',
        session_state: null,
        state: null,
        expires_at: new Date().valueOf() + 100,
        expires_in: 0,
        expired: false,
        scopes: ['email'],
        toStorageString: () => 'toStorageString',
      })

      expect(authStore.user).toMatchObject({
        access_token: 'access_token',
        profile: {
          aud: 'aud',
          sub: 'sub',
          exp: 1,
          iat: 1,
          iss: 'iss',
        },
        token_type: 'token_type',
        /*
        session_state: null,
        state: null,
        expires_in: 0,
        expired: false,
        scopes: ['email'],
        toStorageString: () => 'toStorageString',
        */
      })
      expect(authStore.accessToken).toBe('access_token')
      expect(authStore.isLoggedIn).toBe(true)
    })

    describe('clear action', () => {
      it('resets the store', () => {
        authStore.clear()
        expect(authStore.user).toBeNull()
        expect(authStore.accessToken).toBe('')
        expect(authStore.isLoggedIn).toBeFalsy()
      })
    })
  })

  describe('cookieStorage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('setItem', () => {
      it('calls Cookies set', () => {
        cookieStorage.setItem('key', 'state')
        expect(setCookieSpy).toHaveBeenCalledWith('auth', 'state', {
          expires: 3,
          Secure: true,
          SameSite: 'None',
        })
      })
    })

    describe('getItem', () => {
      it('calls Cookies get', () => {
        cookieStorage.getItem('key')
        expect(getCookieSpy).toHaveBeenCalledWith('auth')
      })
    })
  })
})
