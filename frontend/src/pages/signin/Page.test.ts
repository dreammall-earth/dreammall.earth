import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { authService } from '#tests/mock.authService'

import SigninPage from './+Page.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('SigninPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(SigninPage as Component),
      },
    })
  }

  const authServiceSpy = vi.spyOn(authService, 'signIn')

  describe('signin without error', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      Wrapper()
    })

    it('calls authservie signin', () => {
      expect(authServiceSpy).toBeCalled()
    })

    it('navigates to /', () => {
      expect(navigate).toBeCalledWith('/')
    })
  })

  describe('signin with error', () => {
    const consoleSpy = vi.spyOn(global.console, 'log')

    beforeEach(() => {
      vi.clearAllMocks()
      authServiceSpy.mockRejectedValue('Ouch!')
      Wrapper()
    })

    it('logs the error on console', () => {
      expect(consoleSpy).toBeCalledWith('auth error', 'Ouch!')
    })
  })
})
