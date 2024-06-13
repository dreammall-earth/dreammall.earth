import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent } from 'vue'

import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'
import { mockClient } from '#tests/mock.apolloClient'

import useMyRoom from './useMyRoom'

const joinMyRoomQueryMock = vi.fn()

const testUrl = 'http://some.url'

mockClient.setRequestHandler(joinMyRoomQuery, joinMyRoomQueryMock)

describe('useMyRoom', () => {
  const TestComponent = defineComponent({
    setup() {
      return {
        ...useMyRoom(),
      }
    },
  })
  const Wrapper = () => {
    return mount(TestComponent)
  }

  let wrapper: ReturnType<typeof Wrapper>

  describe('without apollo error', () => {
    beforeEach(() => {
      joinMyRoomQueryMock.mockResolvedValue({ data: { joinMyRoom: testUrl } })
      wrapper = Wrapper()
    })

    it('calls the API', () => {
      expect(joinMyRoomQueryMock).toBeCalled()
    })

    it('returns correct url', async () => {
      await flushPromises()
      expect(wrapper.vm.roomUrl).toBe(testUrl)
    })
  })

  describe('with apollo error', () => {
    const errorMessage = 'Aua!'

    beforeEach(() => {
      wrapper.unmount()
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
