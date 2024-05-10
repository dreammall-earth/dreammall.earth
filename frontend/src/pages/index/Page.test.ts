import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { getRoomQuery } from '#queries/getRoomQuery'
import { mockClient } from '#tests/mock.apolloClient'

import IndexPage from './+Page.vue'
import { title } from './+title'

const getRoomQueryMock = vi.fn()

mockClient.setRequestHandler(
  getRoomQuery,
  getRoomQueryMock.mockResolvedValue({ data: { getRoom: 'http://some.url' } }),
)

describe('IndexPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(IndexPage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = Wrapper()
  })

  it('title returns default title', () => {
    expect(title()).toBe('DreamMall')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('room button', () => {
    const consoleSpy = vi.spyOn(global.console, 'log')

    describe('without error', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        await wrapper.find('button.room-button').trigger('click')
      })

      it('calls the API', () => {
        expect(getRoomQueryMock).toBeCalled()
      })

      it('redirects to url', () => {
        expect(global.window.location.href).toBe('http://some.url/')
      })
    })

    describe('with error', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        getRoomQueryMock.mockRejectedValue({ message: 'Aua!' })
      })

      it('logs error message', async () => {
        try {
          await wrapper.find('button.room-button').trigger('click')
        } catch {
          expect(wrapper).toThrowError()
          expect(consoleSpy).toBeCalledWith('auth error', 'Aua!')
        }
      })
    })
  })
})
