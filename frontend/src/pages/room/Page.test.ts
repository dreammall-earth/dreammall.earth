import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'
import { mockClient } from '#tests/mock.apolloClient'

import RoomPage from './+Page.vue'
import { title } from './+title'

const joinMyRoomQueryMock = vi.fn()

const testUrl = 'http://some.url'

mockClient.setRequestHandler(joinMyRoomQuery, joinMyRoomQueryMock)

describe('Room Page', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(RoomPage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  describe('without apollo error', () => {
    beforeEach(() => {
      joinMyRoomQueryMock.mockResolvedValue({ data: { joinMyRoom: testUrl } })
      wrapper = Wrapper()
    })

    it('title returns default title', () => {
      expect(title()).toBe('DreamMall')
    })

    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('calls the API', () => {
      expect(joinMyRoomQueryMock).toBeCalled()
    })

    it('shows iframe with correct url', async () => {
      await flushPromises()
      expect(wrapper.find('iframe').exists()).toBe(true)
      expect(wrapper.find('iframe').attributes('src')).toBe(testUrl)
    })
  })

  describe('with apollo error', () => {
    const errorMessage = 'Aua!'

    beforeEach(() => {
      vi.clearAllMocks()
      joinMyRoomQueryMock.mockRejectedValue({ message: errorMessage, data: undefined })
      wrapper = Wrapper()
    })

    it('logs error message', async () => {
      const consoleSpy = vi.spyOn(global.console, 'log')
      await flushPromises()
      expect(consoleSpy).toBeCalledWith(errorMessage)
    })
  })
})
