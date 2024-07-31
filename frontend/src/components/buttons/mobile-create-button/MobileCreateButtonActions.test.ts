import { ApolloError } from '@apollo/client/errors'
import { flushPromises, mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinMyTableMutation } from '#mutations/joinMyTableMutation'
import { useActiveTableStore } from '#stores/activeTableStore'
import { mockClient } from '#tests/mock.apolloClient'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import MobileCreateButtonActions from './MobileCreateButtonActions.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const joinMyTableMutationMock = vi.fn()

mockClient.setRequestHandler(joinMyTableMutation, joinMyTableMutationMock)

const activeTableStore = useActiveTableStore()

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

    describe('enter table', () => {
      describe('apollo with success', () => {
        beforeEach(async () => {
          vi.clearAllMocks()
          joinMyTableMutationMock.mockResolvedValue({
            data: {
              joinMyTable: 'http://link-to-my.table',
            },
          })
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyTableMutationMock).toHaveBeenCalled()
        })

        it('updates the store', () => {
          expect(activeTableStore.activeTable).toBe('http://link-to-my.table')
        })

        it('navigates to table page', async () => {
          await flushPromises()
          expect(navigate).toHaveBeenCalledWith('/table/')
        })
      })

      describe('apollo with no data', () => {
        beforeEach(async () => {
          activeTableStore.setActiveTable(null)
          vi.clearAllMocks()
          joinMyTableMutationMock.mockResolvedValue({
            data: null,
          })
          await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyTableMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeTableStore.activeTable).toBeNull()
        })

        it('toasts no table found error', async () => {
          await flushPromises()
          expect(errorHandlerSpy).toHaveBeenCalledWith('No table found')
        })
      })

      describe('apollo with error', () => {
        beforeEach(async () => {
          activeTableStore.setActiveTable(null)
          vi.clearAllMocks()
          joinMyTableMutationMock.mockRejectedValue({
            message: 'OUCH',
          })
          await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyTableMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeTableStore.activeTable).toBeNull()
        })

        it('toasts no table found error', () => {
          expect(errorHandlerSpy).toHaveBeenCalledWith(
            'Error opening table',
            new ApolloError({ errorMessage: 'OUCH' }),
          )
        })
      })
    })
  })
})
