import { ApolloError } from '@apollo/client/errors'
import { provideApolloClient } from '@vue/apollo-composable'
import { flushPromises, mount } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { currentUserQuery } from '#queries/currentUserQuery'
import { joinTableQuery } from '#queries/joinTableQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'
import { setMockPageContext } from '#tests/mock.vikePageContext.js'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import TablePage from './+Page.vue'
import Route from './+route'
import { title } from './+title'

const joinTableQueryMock = vi.fn()
const currentUserQueryMock = vi.fn()
const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()

const mockClient = createMockClient()

mockClient.setRequestHandler(
  currentUserQuery,
  currentUserQueryMock.mockResolvedValue({
    data: {
      currentUser: {
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        table: null,
      },
    },
  }),
)
mockClient.setRequestHandler(
  joinTableQuery,
  joinTableQueryMock.mockResolvedValue({ data: { joinTable: 'https://some-link-to-meeting.com' } }),
)
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)

provideApolloClient(mockClient)

describe('Table Page', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TablePage as Component),
      },
      global: {
        provide: {
          Symbol(pageContext): {
            urlPathname: '/table/69',
            routeParams: {
              id: 69,
            },
          },
        },
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
      setMockPageContext({
        urlPathname: '/table/69',
        routeParams: {
          id: 69,
        },
      })
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

  describe('table is queried again after table id changes', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper.unmount()
      setMockPageContext({
        urlPathname: '/table/69',
        routeParams: {
          id: 69,
        },
      })
      joinTableQueryMock.mockResolvedValue({
        data: { joinTable: 'https://some-link-to-meeting.com' },
      })
      wrapper = Wrapper()
      await flushPromises()
      await navigate('/table/96')
      setMockPageContext({
        urlPathname: '/table/96',
        routeParams: {
          id: 96,
        },
      })
    })

    it('calls the API accordingly', () => {
      expect(joinTableQueryMock).toHaveBeenCalledWith({
        tableId: 96,
      })
    })
  })
})
