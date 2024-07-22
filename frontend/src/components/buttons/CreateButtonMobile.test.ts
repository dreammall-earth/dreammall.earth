import { ApolloError } from '@apollo/client/errors'
import { flushPromises, mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinMyRoomMutation } from '#mutations/joinMyRoomMutation'
import { useActiveRoomStore } from '#stores/activeRoomStore'
import { mockClient } from '#tests/mock.apolloClient'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import CreateButtonMobile from './CreateButtonMobile.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const joinMyRoomMutationMock = vi.fn()

mockClient.setRequestHandler(joinMyRoomMutation, joinMyRoomMutationMock)

const activeRoomStore = useActiveRoomStore()

describe('CreateButtonMobile', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(CreateButtonMobile),
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.findComponent(CreateButtonMobile).element).toMatchSnapshot()
  })

  it('button list content is hidden', () => {
    expect(wrapper.find('.button-list-mobile').classes('button-list-mobile--active')).toBeFalsy()
    expect(wrapper.find('svg g.outer-rings').classes('outer-rings--active')).toBeFalsy()
    expect(wrapper.find('svg g.most-outer-rings').classes('most-outer-rings--active')).toBeFalsy()
  })

  describe('click on create button', () => {
    it('emits click event', async () => {
      await wrapper.find('#create-button-mobile').trigger('click')
      const component = wrapper.findComponent(CreateButtonMobile)
      expect(component.emitted()).toHaveProperty('click', [[1]])
    })

    it('button list visible', async () => {
      await wrapper.find('#create-button-mobile').trigger('click')
      expect(wrapper.find('.button-list-mobile').classes('button-list-mobile--active')).toBeTruthy()
      expect(wrapper.find('svg g.outer-rings').classes('outer-rings--active')).toBeTruthy()
      expect(
        wrapper.find('svg g.most-outer-rings').classes('most-outer-rings--active'),
      ).toBeTruthy()
    })
  })

  describe('new table button', () => {
    beforeEach(async () => {
      wrapper = Wrapper()
      await wrapper.find('#create-button-mobile').trigger('click')
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
          await wrapper.find('#create-button-mobile').trigger('click')
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
          await wrapper.find('#create-button-mobile').trigger('click')
          await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyRoomMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeRoomStore.activeRoom).toBe(null)
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
          await wrapper.find('#create-button-mobile').trigger('click')
          await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyRoomMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeRoomStore.activeRoom).toBe(null)
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
