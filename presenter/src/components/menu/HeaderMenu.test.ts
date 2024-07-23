import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { AUTH } from '#src/env'

import HeaderMenu from './HeaderMenu.vue'

describe('HeaderMenu', () => {
  it('renders', () => {
    AUTH.SIGNUP_URI = ''
    AUTH.SIGNIN_URI = ''

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
      AUTH.SIGNUP_URI = 'http://sign-up.uri'
      AUTH.SIGNIN_URI = 'http://sigin-in.uri'
      wrapper = Wrapper()
    })

    it('has a sign in button', () => {
      expect(wrapper.find('button.sign-in').exists()).toBeTruthy
    })

    describe('sign in button', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        await wrapper.find('button.sign-in').trigger('click')
      })

      it('changes window location', () => {
        expect(global.window.location.href).toBe('http://sigin-in.uri/')
      })
    })

    describe('sign up button', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        await wrapper.find('button.sign-up').trigger('click')
      })

      it('changes window location', () => {
        expect(global.window.location.href).toBe('http://sign-up.uri/')
      })
    })
  })
})
