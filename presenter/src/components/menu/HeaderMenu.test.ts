import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import HeaderMenu from './HeaderMenu.vue'

describe('HeaderMenu', () => {
  it('renders', () => {
    const wrapper = mount(VApp, {
      slots: {
        default: h(HeaderMenu as Component, {
          auth: {
            SIGNUP_URI: '',
            SIGNIN_URI: '',
          },
        }),
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  describe('auth service active', () => {
    const Wrapper = () => {
      return mount(VApp, {
        slots: {
          default: h(HeaderMenu as Component, {
            auth: {
              SIGNUP_URI: 'http://sign-up.uri',
              SIGNIN_URI: 'http://signin-in.uri',
            },
          }),
        },
      })
    }

    it('has a sign in button', () => {
      const wrapper = Wrapper()
      expect(wrapper.find('button.sign-in').exists()).toBe(true)
    })

    describe('sign in button', () => {
      it('changes window location', async () => {
        const wrapper = Wrapper()
        vi.clearAllMocks()
        await wrapper.find('button.sign-in').trigger('click')
        expect(global.window.location.href).toBe('http://signin-in.uri/')
      })
    })

    describe('sign up button', () => {
      it('changes window location', async () => {
        const wrapper = Wrapper()
        vi.clearAllMocks()
        await wrapper.find('button.sign-up').trigger('click')
        expect(global.window.location.href).toBe('http://sign-up.uri/')
      })
    })
  })
})
