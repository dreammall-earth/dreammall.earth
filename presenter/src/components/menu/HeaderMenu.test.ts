import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { AUTH } from '#src/env'
import { authService } from '#tests/mock.authService'

import HeaderMenu from './HeaderMenu.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('HeaderMenu', () => {
  it('renders', () => {
    AUTH.AUTHORITY = ''
    AUTH.AUTHORITY_SIGNUP_URI = ''

    const wrapper = mount(VApp, {
      slots: {
        default: h(HeaderMenu as Component),
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  describe('auth service active', () => {
    const Wrapper = () => {
      return mount(VApp, {
        slots: {
          default: h(HeaderMenu as Component),
        },
      })
    }

    let wrapper: ReturnType<typeof Wrapper>

    beforeEach(() => {
      AUTH.AUTHORITY = 'authority'
      AUTH.AUTHORITY_SIGNUP_URI = 'http://sign-up.uri'
      wrapper = Wrapper()
    })

    it('has a sign in button', () => {
      expect(wrapper.find('button.sign-in').exists()).toBe(true)
    })

    describe('sign in button', () => {
      const authServiceSpy = vi.spyOn(authService, 'signIn')

      describe('without error', () => {
        beforeEach(async () => {
          vi.clearAllMocks()
          await wrapper.find('button.sign-in').trigger('click')
        })

        it('calls sign in from auth service', () => {
          expect(authServiceSpy).toBeCalled()
        })

        it('navigates to /', () => {
          expect(navigate).toBeCalledWith('/')
        })
      })

      describe('with error', () => {
        const consoleSpy = vi.spyOn(global.console, 'log')

        beforeEach(async () => {
          vi.clearAllMocks()
          authServiceSpy.mockRejectedValue('Ouch!')
          await wrapper.find('button.sign-in').trigger('click')
        })

        it('logs the error to console', () => {
          expect(consoleSpy).toBeCalledWith('auth error', 'Ouch!')
        })
      })
    })

    /*
    describe('sign up button', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        wrapper.find('button.sign-up').trigger('click')
      })

      // how to redirect correctly (navigate vs recirect)?
      it('redirects to sign up url', () => {
        expect(true).toBe(true)
      })
    })

    describe('logged in', () => {})
    */
  })
})
