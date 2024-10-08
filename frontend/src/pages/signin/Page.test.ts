import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import i18n from '#plugins/i18n'
import { useAuthStore } from '#stores/authStore'
import { authService } from '#tests/mock.authService'
import { createMockPlugin } from '#tests/plugin.globalErrorHandler'

import SigninPage from './+Page.vue'
import { title } from './+title'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const { mockPlugin, errorSpy } = createMockPlugin()

describe('SigninPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      global: { plugins: [mockPlugin] },
      slots: {
        default: h(SigninPage as Component),
      },
    })
  }

  const authServiceSpy = vi.spyOn(authService, 'signIn')

  describe('not signed in', () => {
    it('title returns correct title', () => {
      expect(title()).toBe(i18n.global.t('auth.title'))
    })

    describe('signin without error', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        Wrapper()
      })

      it('calls authservice signin', () => {
        expect(authServiceSpy).toHaveBeenCalledWith(undefined)
      })

      it('navigates to /', () => {
        expect(navigate).toHaveBeenCalledWith('/')
      })
    })

    describe('signin with error', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        authServiceSpy.mockRejectedValue('Ouch!')
        Wrapper()
      })

      it('logs the error on console', () => {
        expect(errorSpy).toHaveBeenCalledWith(new Error('auth error', { cause: 'Ouch!' }))
      })
    })
  })

  describe('already signed in', () => {
    const auth = useAuthStore()
    beforeEach(() => {
      vi.clearAllMocks()
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
      Wrapper()
    })

    it('navigates to /', () => {
      expect(navigate).toHaveBeenCalledWith('/')
    })

    it('does not call auth service', () => {
      expect(authServiceSpy).not.toHaveBeenCalled()
    })
  })
})
