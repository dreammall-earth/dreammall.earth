import { mount, flushPromises } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { confirmNewsletter } from '#mutations/confirmNewsletter'
import i18n from '#plugins/i18n'
import { mockClient } from '#tests/mock.apolloClient'

import OptinPage from './+Page.vue'
import route from './+route'
import { title } from './+title'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const confirmNewsletterMock = vi.fn()

mockClient.setRequestHandler(
  confirmNewsletter,
  confirmNewsletterMock.mockResolvedValue({ data: { confirmNewsletter: true } }),
)

describe('OptinPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(OptinPage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(() => {
    wrapper = Wrapper()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('title returns correct title', () => {
    expect(title()).toBe(i18n.global.t('optin.title'))
  })

  it('route returns `/optin/@code', () => {
    expect(route).toBe('/optin/@code')
  })

  describe('API call with success', () => {
    it('calls the API', () => {
      expect(confirmNewsletterMock).toHaveBeenCalledWith({ code: 'my-code' })
    })

    it('renders success', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    describe('run all timers', () => {
      beforeEach(async () => {
        vi.runOnlyPendingTimers()
        await flushPromises()
      })

      it('redirects to /', () => {
        expect(navigate).toHaveBeenCalledWith('/')
      })
    })
  })

  describe('API call with failure', () => {
    beforeEach(async () => {
      confirmNewsletterMock.mockResolvedValue({ data: { confirmNewsletter: false } })
      wrapper = Wrapper()
      await flushPromises()
    })

    it('renders error message', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('API call with error', () => {
    beforeEach(async () => {
      confirmNewsletterMock.mockRejectedValue({ message: 'Ouch' })
      wrapper = Wrapper()
      await flushPromises()
    })

    it('renders error message', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
