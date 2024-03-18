import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { useAuthStore } from '#stores/authStore'
import { authService } from '#tests/mock.authService'

import AuthPage from './+Page.vue'
import { title } from './+title'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('AuthPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(AuthPage as Component),
      },
    })
  }

  const authServiceSpy = vi.spyOn(authService, 'signInCallback')
  const authStore = useAuthStore()

  let wrapper: ReturnType<typeof Wrapper>

  describe('signin callback without error', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      authServiceSpy.mockResolvedValue({
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
        expires_in: 0,
        expired: false,
        scopes: ['email'],
        toStorageString: () => 'toStorageString',
      })
      wrapper = Wrapper()
    })

    it('title returns correct title', () => {
      expect(title).toBe('DreamMall | Authentifizierung')
    })

    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('calls authservie signin callback', () => {
      expect(authServiceSpy).toBeCalled()
    })

    it('updates the store', () => {
      expect(authStore.save).toBeCalledWith(
        expect.objectContaining({
          access_token: 'access_token',
          profile: {
            aud: 'aud',
            sub: 'sub',
            exp: 1,
            iat: 1,
            iss: 'iss',
          },
          token_type: 'token_type',
        }),
      )
    })

    it('navigates to /', () => {
      expect(navigate).toBeCalledWith('/')
    })
  })

  describe('no user returned', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      authServiceSpy.mockResolvedValue()
    })

    it('throws an error', () => {
      try {
        wrapper = Wrapper()
      } catch (err) {
        expect(err).toBe('Could not Sign In')
      }
    })
  })

  describe('signin callback with error', () => {
    const consoleSpy = vi.spyOn(global.console, 'log')

    beforeEach(() => {
      vi.clearAllMocks()
      authServiceSpy.mockRejectedValue('Ouch!')
      wrapper = Wrapper()
    })

    it('logs the error on console', () => {
      expect(consoleSpy).toBeCalledWith('auth error', 'Ouch!')
    })
  })
})
