import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinMyRoomMutation } from '#mutations/joinMyRoomMutation'
import { mockClient } from '#tests/mock.apolloClient'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import RoomPage from './+Page.vue'
import { title } from './+title'

const joinMyRoomMutationMock = vi.fn()

const testUrl = 'http://some.url'

mockClient.setRequestHandler(joinMyRoomMutation, joinMyRoomMutationMock)

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
      joinMyRoomMutationMock.mockResolvedValue({ data: { joinMyRoom: testUrl } })
      wrapper = Wrapper()
    })

    it('title returns default title', () => {
      expect(title()).toBe('DreamMall')
    })

    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('calls the API', () => {
      expect(joinMyRoomMutationMock).toBeCalled()
    })

    it('shows iframe with correct url', async () => {
      await flushPromises()
      expect(wrapper.find('iframe').exists()).toBe(true)
      expect(wrapper.find('iframe').attributes('src')).toBe(testUrl)
    })
  })

  describe('with apollo error', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      joinMyRoomMutationMock.mockRejectedValue({ message: 'Aua!', data: undefined })
      wrapper = Wrapper()
    })

    it('logs error message', async () => {
      await flushPromises()
      expect(errorHandlerSpy).toBeCalledWith('Aua!')
    })
  })
})
