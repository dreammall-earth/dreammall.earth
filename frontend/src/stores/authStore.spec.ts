import Cookies from 'js-cookie'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { cookieStorage, useAuthStore } from './authStore'

vi.mock('js-cookie')
// eslint-disable-next-line @typescript-eslint/unbound-method
vi.mocked(Cookies.get as (name: string) => string | undefined).mockReturnValue('cookie')

const setCookieSpy = vi.spyOn(Cookies, 'set')
const getCookieSpy = vi.spyOn(Cookies, 'get')

describe('Auth Store', () => {
  setActivePinia(createPinia())
  const authStore = useAuthStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(authStore.user).toBe(null)
      expect(authStore.accessToken).toBe('')
      expect(authStore.isLoggedIn).toBe(false)
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
        expect(authStore.user).toBe(null)
        expect(authStore.accessToken).toBe('')
        expect(authStore.isLoggedIn).toBe(false)
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
        expect(setCookieSpy).toBeCalledWith('auth', 'state', {
          expires: 3,
          SameSite: 'none',
          Secure: true,
        })
      })
    })

    describe('getItem', () => {
      it('calls Cookies get', () => {
        const result = cookieStorage.getItem('key')
        expect(getCookieSpy).toBeCalledWith('auth')
        expect(result).toBe('cookie')
      })

      describe('no cookie set', () => {
        it('returns null', () => {
          // eslint-disable-next-line @typescript-eslint/unbound-method
          vi.mocked(Cookies.get as (name: string) => string | undefined).mockReturnValue(undefined)
          expect(cookieStorage.getItem('key')).toBe(null)
        })
      })
    })
  })
})
