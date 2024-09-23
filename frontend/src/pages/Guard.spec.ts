import { redirect } from 'vike/abort'
import { PageContextServer } from 'vike/types'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useAuthStore } from '#stores/authStore.js'

import { guard } from './+guard'

vi.mock('vike/abort')
vi.mocked(redirect).mockResolvedValue(new Error(''))

describe('global route guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('unauthenticated', () => {
    it('throws and redirects', () => {
      /* We expect redirect('/signin/') to be thrown, but it's an object,
         which is not an acceptable argument for toThrow(). */
      /* eslint-disable-next-line vitest/require-to-throw-message */
      expect(() => guard({ hasToken: false, urlPathname: '/' } as PageContextServer)).toThrow()
      expect(redirect).toHaveBeenCalledWith('/signin/')
    })

    it('throws and redirects passing the path', () => {
      /* We expect redirect('/signin/x/23') to be thrown, but it's an object,
         which is not an acceptable argument for toThrow(). */
      /* eslint-disable-next-line vitest/require-to-throw-message */
      expect(() => guard({ hasToken: false, urlPathname: '/x/23' } as PageContextServer)).toThrow()
      expect(redirect).toHaveBeenCalledWith('/signin/x/23')
    })
  })

  describe('authenticated', () => {
    const auth = useAuthStore()

    beforeEach(() => {
      auth.save({
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
    })

    it('does not redirect', () => {
      guard({ hasToken: true } as PageContextServer)
      expect(redirect).not.toHaveBeenCalled()
    })
  })
})
