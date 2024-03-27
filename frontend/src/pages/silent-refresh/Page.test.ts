import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import i18n from '#plugins/i18n'
import { authService } from '#tests/mock.authService'

import SilentRefreshPage from './+Page.vue'
import { title } from './+title'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('SilentRefreshPage', () => {
  const authServiceSpy = vi.spyOn(authService, 'renewToken')

  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(SilentRefreshPage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  describe('auth service with succes', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })

    it('title returns correct title', () => {
      expect(title()).toBe(i18n.global.t('auth.title'))
    })

    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('calls renew token of auth service', () => {
      expect(authServiceSpy).toBeCalled()
    })

    it('navigatesto /', () => {
      expect(navigate).toBeCalledWith('/')
    })
  })

  describe('auth service throws', () => {
    const consoleSpy = vi.spyOn(global.console, 'log')

    beforeEach(() => {
      authServiceSpy.mockRejectedValue('Ouch!')
      wrapper = Wrapper()
    })

    it('logs error to console', () => {
      expect(consoleSpy).toBeCalledWith('auth error', 'Ouch!')
    })
  })
})
