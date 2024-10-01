import { ApolloError } from '@apollo/client/errors'
import { provideApolloClient } from '@vue/apollo-composable'
import { flushPromises, mount } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h, reactive } from 'vue'
import { VApp } from 'vuetify/components'

import { vikePageContext } from '#context/usePageContext'
import { currentUserQuery } from '#queries/currentUserQuery'
import { joinTableQuery } from '#queries/joinTableQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'
import { mockPageContext as globalMockPageContext } from '#tests/mock.vikePageContext'
import { createMockPlugin } from '#tests/plugin.globalErrorHandler'

import TablePage from './+Page.vue'
import { title } from './+title'

import type { PageContext } from 'vike/types'

const joinTableQueryMock = vi.fn()
const currentUserQueryMock = vi.fn()
const updateTablesSubscriptionMock: IMockSubscription = createMockSubscription()

const mockClient = createMockClient()

const { mockPlugin, errorSpy } = createMockPlugin()

const META: PageContext['publicEnv']['META'] = {
  BASE_URL: 'http://localhost:3000',
  DEFAULT_AUTHOR: 'Whatever',
}

const mockPageContext = reactive({
  ...globalMockPageContext,
  publicEnv: { META },
})

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
  joinTableQueryMock.mockResolvedValue({
    data: {
      joinTable: {
        link: 'https://some-link-to-meeting.com',
        isModerator: true,
        type: 'MALL_TALK',
      },
    },
  }),
)
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateTablesSubscriptionMock)

provideApolloClient(mockClient)

describe('Table Page', () => {
  const Wrapper = () => {
    return mount(VApp, {
      global: {
        plugins: [mockPlugin],
        provide: {
          toast: { success: () => {} },
          [vikePageContext as symbol]: mockPageContext,
        },
      },
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
      const cause = new ApolloError({ errorMessage: 'table does not exist' })
      expect(errorSpy).toHaveBeenCalledWith(new Error('Fehler beim Öffnen des Tisches', { cause }))
    })
  })

  describe('route params in page context contains an id and API throws error', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper.unmount()
      mockPageContext.routeParams = {
        id: 70,
      }
      joinTableQueryMock.mockResolvedValue({
        errors: [{ message: 'Table does not exist' }],
      })
      wrapper = Wrapper()
      await flushPromises()
    })

    it('does not show an iframe', () => {
      expect(wrapper.find('iframe').exists()).toBeFalsy()
    })

    it('renders table not found message', () => {
      expect(wrapper.find('.test-not-found').exists()).toBeTruthy()
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
        data: {
          joinTable: {
            link: 'https://some-link-to-meeting.com',
            isModerator: true,
            type: 'MALL_TALK',
          },
          errors: [],
        },
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

    it('open table changes when url changes', async () => {
      mockPageContext.routeParams = {
        id: 420,
      }
      await flushPromises()
      expect(joinTableQueryMock).toHaveBeenCalledWith({
        tableId: 420,
      })
    })
  })
})
