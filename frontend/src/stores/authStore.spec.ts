import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect } from 'vitest'

import { useAuthStore } from './authStore'

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
})
