import { redirect } from 'vike/abort'
import { PageContextServer } from 'vike/types'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'

import { guard } from './+guard'

AUTH.UNAUTHORIZED_REDIRECT_URI = 'https://some.uri'

vi.mock('vike/abort')
vi.mocked(redirect).mockResolvedValue(new Error(''))

let pageContext: PageContextServer

describe('global route guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('unauthenticated', () => {
    it('throws and redirects', async () => {
      try {
        await guard(pageContext)
      } catch (error) {
        expect(redirect).toBeCalledWith('https://some.uri')
      }
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

    it('does not redirect', async () => {
      await guard(pageContext)
      expect(redirect).not.toBeCalled()
    })
  })
})
