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
      const consoleSpy = vi.spyOn(global.console, 'error')
      await flushPromises()
      expect(consoleSpy).toBeCalledWith('error: ' + errorMessage)
    })
  })

  describe('with error and toast popup', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const closeButtonSelector = 'button.Toastify__close-button'

    // vi.useFakeTimers()

    beforeEach(() => {
      vi.clearAllMocks()
      joinMyRoomQueryMock.mockRejectedValue({ message: 'Aua!' })
    })

    beforeEach(async () => {
      await wrapper.find('button.room-button').trigger('click')
      // await flushPromises()
      // await vi.advanceTimersByTimeAsync(1000)
    })

    it('exists', () => {
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      // expect(consoleError).toBeCalledWith('test')
      // expect(consoleError).toHaveBeenCalledOnce()
      expect(consoleError).toHaveBeenLastCalledWith('error: test', undefined)
      expect(consoleLog).toHaveBeenCalledTimes(0)

      expect(wrapper.find('div.Toastify').exists()).toBe(true)
      expect(wrapper.find(closeButtonSelector).exists()).toBe(true)
    })

    describe('close by click', () => {
      beforeEach(async () => {
        await wrapper.find(closeButtonSelector).trigger('click')
      })

      it('does not exist', () => {
        expect(wrapper.find(closeButtonSelector).exists()).toBe(false)
      })
    })
  })

  // describe('Toastify plugin', () => {
  //   it('shows a toast message', async () => {
  //     const wrapper = mount(VApp, {
  //       global: {
  //         plugins: [Vue3Toasity],
  //       },
  //     })
  //
  //     vi.useFakeTimers()
  //
  //     toast.error('Test Toast')
  //     await vi.advanceTimersByTimeAsync(1000)
  //
  //     // await new Promise((resolve) => setTimeout(resolve, 1000))
  //     await flushPromises()
  //
  //     expect(wrapper.find('div.Toastify').exists()).toBe(true)
  //   })
  // })
})
