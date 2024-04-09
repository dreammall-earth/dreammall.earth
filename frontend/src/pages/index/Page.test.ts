import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

// eslint-disable-next-line import/no-relative-parent-imports
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
        await wrapper.find('button.room-button').trigger('click')
      })

      it('calls the API', () => {
        expect(getRoomQueryMock).toBeCalled()
      })

      it('logs message', () => {
        expect(consoleSpy).toBeCalledWith('Redirect to http://some.url')
      })
    })

    describe.skip('with error', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        getRoomQueryMock.mockRejectedValue({ message: 'Aua!' })
        wrapper = Wrapper()
        await wrapper.find('button.room-button').trigger('click')
      })

      it('logs error message', () => {
        expect(consoleSpy).toBeCalledWith('auth error', 'Aua!')
      })
    })
  })
})
