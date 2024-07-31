import { ApolloError } from '@apollo/client/errors'
import { flushPromises, mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { joinMyTableMutation } from '#mutations/joinMyTableMutation'
import { useActiveTableStore } from '#stores/activeTableStore'
import { mockClient } from '#tests/mock.apolloClient'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import CreateButton from './CreateButton.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const joinMyTableMutationMock = vi.fn()

mockClient.setRequestHandler(joinMyTableMutation, joinMyTableMutationMock)

const activeTableStore = useActiveTableStore()

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

    describe('enter table', () => {
      describe('apollo with success', () => {
        beforeEach(async () => {
          vi.clearAllMocks()
          joinMyTableMutationMock.mockResolvedValue({
            data: {
              joinMyTable: 'http://link-to-my.table',
            },
          })
          await wrapper.find('#create-button').trigger('click')
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
          await wrapper.find('#create-button').trigger('click')
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyTableMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeTableStore.activeTable).toBeNull()
        })

        // it('toasts no table found error', () => {
        //   expect(errorHandlerSpy).toHaveBeenCalledWith('No table found')
        // })
      })

      describe('apollo with error', () => {
        beforeEach(async () => {
          activeTableStore.setActiveTable(null)
          vi.clearAllMocks()
          joinMyTableMutationMock.mockRejectedValue({
            message: 'OUCH',
          })
          await wrapper.find('#create-button').trigger('click')
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          expect(joinMyTableMutationMock).toHaveBeenCalledWith({})
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
