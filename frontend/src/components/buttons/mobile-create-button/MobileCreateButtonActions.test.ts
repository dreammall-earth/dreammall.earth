import { ApolloError } from '@apollo/client/errors'
import { flushPromises, mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinMyRoomMutation } from '#mutations/joinMyRoomMutation'
import { useActiveRoomStore } from '#stores/activeRoomStore'
import { mockClient } from '#tests/mock.apolloClient'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import MobileCreateButtonActions from './MobileCreateButtonActions.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const joinMyRoomMutationMock = vi.fn()

mockClient.setRequestHandler(joinMyRoomMutation, joinMyRoomMutationMock)

const activeRoomStore = useActiveRoomStore()

describe('MobileCreateButtonActions', () => {
  const Wrapper = (props = { isVisible: true }) => {
    return mount(VApp, {
      slots: {
        default: h(MobileCreateButtonActions, props),
      },
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders open', () => {
    wrapper = Wrapper()
    expect(wrapper.findComponent(MobileCreateButtonActions).element).toMatchSnapshot()
  })

  it('renders closed', () => {
    wrapper = Wrapper({ isVisible: false })
    expect(wrapper.findComponent(MobileCreateButtonActions).element).toMatchSnapshot()
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
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyRoomMutationMock).toHaveBeenCalled()
        })

        it('updates the store', () => {
          expect(activeRoomStore.activeRoom).toBe('http://link-to-my.room')
        })

        it('navigates to room page', async () => {
          await flushPromises()
          expect(navigate).toHaveBeenCalledWith('/room/')
        })
      })

      describe('apollo with no data', () => {
        beforeEach(async () => {
          activeRoomStore.setActiveRoom(null)
          vi.clearAllMocks()
          joinMyRoomMutationMock.mockResolvedValue({
            data: null,
          })
          await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyRoomMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeRoomStore.activeRoom).toBeNull()
        })

        it('toasts no room found error', async () => {
          await flushPromises()
          expect(errorHandlerSpy).toHaveBeenCalledWith('No room found')
        })
      })

      describe('apollo with error', () => {
        beforeEach(async () => {
          activeRoomStore.setActiveRoom(null)
          vi.clearAllMocks()
          joinMyRoomMutationMock.mockRejectedValue({
            message: 'OUCH',
          })
          await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyRoomMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeRoomStore.activeRoom).toBeNull()
        })

        it('toasts no room found error', () => {
          expect(errorHandlerSpy).toHaveBeenCalledWith(
            'Error opening room',
            new ApolloError({ errorMessage: 'OUCH' }),
          )
        })
      })
    })
  })
})
