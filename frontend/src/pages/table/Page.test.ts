import { ApolloError } from '@apollo/client/errors'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinTableQuery } from '#queries/joinTableQuery'
import { setupMockClient } from '#tests/mock.apolloClient'
import { mockPageContext } from '#tests/mock.vikePageContext'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import TablePage from './+Page.vue'
import Route from './+route'
import { title } from './+title'

const joinTableQueryMock = vi.fn()

const mockClient = setupMockClient()

mockClient.setRequestHandler(
  joinTableQuery,
  joinTableQueryMock.mockResolvedValue({ data: { joinTable: 'https://some-link-to-meeting.com' } }),
)

describe('Table Page', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TablePage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('title returns default title', () => {
    expect(title()).toBe('DreamMall')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('has tableID as param', () => {
    expect(Route).toBe('/table/@id')
  })

  describe('route params in page context is undefined and API throws error', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper.unmount()
      joinTableQueryMock.mockRejectedValue({ message: 'table does not exist' })
      wrapper = Wrapper()
      await flushPromises()
    })

    it('calls the API accordingly', () => {
      expect(joinTableQueryMock).toHaveBeenCalledWith({
        tableId: NaN,
      })
    })

    it('does not show an iframe', () => {
      expect(wrapper.find('iframe').exists()).toBe(false)
    })

    it('toasts an error', () => {
      expect(errorHandlerSpy).toHaveBeenCalledWith(
        'Error opening table',
        new ApolloError({ errorMessage: 'table does not exist' }),
      )
    })
  })

  describe('route params in page context contains an id and API returns link', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper.unmount()
      mockPageContext.routeParams = {
        id: 69,
      }
      joinTableQueryMock.mockResolvedValue({
        data: { joinTable: 'https://some-link-to-meeting.com' },
      })
      wrapper = Wrapper()
      await flushPromises()
    })

    it('calls the API accordingly', () => {
      expect(joinTableQueryMock).toHaveBeenCalledWith({
        tableId: 69,
      })
    })

    it('shows an iframe', () => {
      expect(wrapper.find('iframe').exists()).toBe(true)
    })
  })
})
