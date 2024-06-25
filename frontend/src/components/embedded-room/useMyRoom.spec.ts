import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent } from 'vue'

import { joinMyRoomMutation } from '#mutations/joinMyRoomMutation'
import { mockClient } from '#tests/mock.apolloClient'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import useMyRoom from './useMyRoom'

const joinMyRoomMutationMock = vi.fn()

const testUrl = 'http://some.url'

mockClient.setRequestHandler(joinMyRoomMutation, joinMyRoomMutationMock)

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
      joinMyRoomMutationMock.mockResolvedValue({ data: { joinMyRoom: testUrl } })
      wrapper = Wrapper()
    })

    it('calls the API', () => {
      expect(joinMyRoomMutationMock).toBeCalled()
    })

    it('returns correct url', async () => {
      await flushPromises()
      expect(wrapper.vm.roomUrl).toBe(testUrl)
    })
  })

  describe('with apollo error', () => {
    beforeEach(() => {
      wrapper.unmount()
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
