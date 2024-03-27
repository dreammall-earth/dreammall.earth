import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'
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

    describe('sign up button', () => {
      const spy = vi.spyOn(authService, 'signUp')

      beforeEach(() => {
        vi.clearAllMocks()
      })

      describe('without error', () => {
        beforeEach(async () => {
          await wrapper.find('button.sign-up').trigger('click')
        })

        it('call auth service signUp', () => {
          expect(spy).toBeCalled()
        })
      })

      describe('with error', () => {
        const consoleSpy = vi.spyOn(console, 'log')

        beforeEach(async () => {
          spy.mockRejectedValue('Oh no!')
          await wrapper.find('button.sign-up').trigger('click')
        })

        it('logs the error', () => {
          expect(consoleSpy).toBeCalledWith('auth error', 'Oh no!')
        })
      })
    })

    describe('logged in', () => {
      const authStore = useAuthStore()

      beforeEach(() => {
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
          expires_in: 0,
          expired: false,
          scopes: ['email'],
          toStorageString: () => 'toStorageString',
        })
      })

      it('has a sign out button', () => {
        expect(wrapper.find('button.sign-out').exists()).toBe(true)
      })

      it('has no sign in/up button', () => {
        expect(wrapper.find('button.sign-up').exists()).toBe(false)
        expect(wrapper.find('button.sign-in').exists()).toBe(false)
      })

      describe('click sign out', () => {
        const authSpy = vi.spyOn(authService, 'signOut')
        const storeSpy = vi.spyOn(authStore, 'clear')

        beforeEach(() => {
          vi.clearAllMocks()
        })

        describe('without error', () => {
          beforeEach(async () => {
            await wrapper.find('button.sign-out').trigger('click')
          })

          it('calls auth service sign out', () => {
            expect(authSpy).toBeCalled()
          })

          it('clears the store', () => {
            expect(storeSpy).toBeCalled()
          })
        })

        describe('with error', () => {
          const consoleSpy = vi.spyOn(console, 'log')

          beforeEach(async () => {
            authSpy.mockRejectedValue('Error!')
            await wrapper.find('button.sign-out').trigger('click')
          })

          it('logs the error', () => {
            expect(consoleSpy).toBeCalledWith('auth error', 'Error!')
          })
        })
      })
    })
  })
})
