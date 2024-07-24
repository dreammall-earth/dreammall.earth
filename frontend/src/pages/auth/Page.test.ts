import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import i18n from '#plugins/i18n'
import { authService } from '#tests/mock.authService'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

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
      expect(title()).toBe(i18n.global.t('auth.title'))
    })

    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('calls authservie signin callback', () => {
      expect(authServiceSpy).toHaveBeenCalledWith()
    })

    it('navigates to /', () => {
      expect(navigate).toHaveBeenCalledWith('/')
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
        // eslint-disable-next-line vitest/no-conditional-expect
        expect(err).toBe('Could not Sign In')
      }
    })
  })

  describe('signin callback with error', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      authServiceSpy.mockRejectedValue('Ouch!')
      wrapper = Wrapper()
    })

    it('logs the error on console', () => {
      expect(errorHandlerSpy).toHaveBeenCalledWith('auth error', 'Ouch!')
    })
  })
})
