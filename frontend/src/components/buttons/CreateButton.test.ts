import { ApolloError } from '@apollo/client/errors'
import { flushPromises, mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { joinMyRoomMutation } from '#mutations/joinMyRoomMutation'
import { useActiveRoomStore } from '#stores/activeRoomStore'
import { mockClient } from '#tests/mock.apolloClient'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import CreateButton from './CreateButton.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const joinMyRoomMutationMock = vi.fn()

mockClient.setRequestHandler(joinMyRoomMutation, joinMyRoomMutationMock)

const activeRoomStore = useActiveRoomStore()

describe('CreateButton', () => {
  const Wrapper = () => {
    return mount(CreateButton, {
      props: {},
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('button list content is hidden', () => {
    expect(wrapper.find('.new-project-button').exists()).toBe(false)
    expect(wrapper.find('.new-table-button').exists()).toBe(false)
    expect(wrapper.find('.assistent-button').exists()).toBe(false)
  })

  describe('click on create button', () => {
    it('emits click event', async () => {
      await wrapper.find('#create-button').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('click', [[1]])
    })

    it('button list visible', async () => {
      await wrapper.find('#create-button').trigger('click')
      expect(wrapper.find('.new-project-button').exists()).toBe(true)
      expect(wrapper.find('.new-table-button').exists()).toBe(true)
      expect(wrapper.find('.assistant-button').exists()).toBe(true)
    })
  })

  describe('new table button', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })

    describe('enter room', () => {
      describe('apollo with success', () => {
        beforeEach(async () => {
          vi.clearAllMocks()
          joinMyRoomMutationMock.mockResolvedValue({
            data: {
              joinMyRoom: 'http://link-to-my.room',
            },
          })
          await wrapper.find('#create-button').trigger('click')
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          expect(joinMyRoomMutationMock).toBeCalled()
        })

        it('updates the store', () => {
          expect(activeRoomStore.activeRoom).toBe('http://link-to-my.room')
        })

        it('navigates to room page', async () => {
          await flushPromises()
          expect(navigate).toBeCalledWith('/room/')
        })
      })

      describe('apollo with no data', () => {
        beforeEach(async () => {
          activeRoomStore.setActiveRoom(null)
          vi.clearAllMocks()
          joinMyRoomMutationMock.mockResolvedValue({
            data: null,
          })
          await wrapper.find('#create-button').trigger('click')
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          expect(joinMyRoomMutationMock).toBeCalled()
        })

        it('does not update the store', () => {
          expect(activeRoomStore.activeRoom).toBe(null)
        })

        it('toasts no room found error', async () => {
          await flushPromises()
          expect(errorHandlerSpy).toBeCalledWith('No room found')
        })
      })

      describe('apollo with error', () => {
        beforeEach(async () => {
          activeRoomStore.setActiveRoom(null)
          vi.clearAllMocks()
          joinMyRoomMutationMock.mockRejectedValue({
            message: 'OUCH',
          })
          await wrapper.find('#create-button').trigger('click')
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          expect(joinMyRoomMutationMock).toBeCalled()
        })

        it('does not update the store', () => {
          expect(activeRoomStore.activeRoom).toBe(null)
        })

        it('toasts no room found error', () => {
          expect(errorHandlerSpy).toBeCalledWith(
            'Error opening room',
            new ApolloError({ errorMessage: 'OUCH' }),
          )
        })
      })
    })
  })
})
