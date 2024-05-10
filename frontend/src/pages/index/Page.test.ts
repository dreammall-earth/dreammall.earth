import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'
import { mockClient } from '#tests/mock.apolloClient'

import IndexPage from './+Page.vue'
import { title } from './+title'

const joinMyRoomQueryMock = vi.fn()

mockClient.setRequestHandler(
  joinMyRoomQuery,
  joinMyRoomQueryMock.mockResolvedValue({ data: { joinMyRoom: 'http://some.url' } }),
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
    const windowOpenSpy = vi.spyOn(window, 'open')

    describe('without error', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        await wrapper.find('button.room-button').trigger('click')
      })

      it('calls the API', () => {
        expect(joinMyRoomQueryMock).toBeCalled()
      })

      it.skip('opens url in new tab', () => {
        expect(windowOpenSpy).toBeCalledWith('http://some.url/', '_blank')
      })
    })

    describe('with error', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        joinMyRoomQueryMock.mockRejectedValue({ message: 'Aua!' })
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
