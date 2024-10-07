import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { gql } from 'graphql-tag'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { currentUserQuery } from '#queries/currentUserQuery'
import { tablesQuery } from '#queries/tablesQuery'
import { inviteTableSubscription } from '#subscriptions/inviteTableSubscription'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import IndexPage from './+Page.vue'
import { title } from './+title'

const tablesQueryMock = vi.fn()
const mockSubscription: IMockSubscription = createMockSubscription()
const currentUserQueryMock = vi.fn()
const updateTablesSubscriptionMock: IMockSubscription = createMockSubscription()
const inviteTableSubscriptionMock: IMockSubscription = createMockSubscription()

const mockClient = createMockClient()

mockClient.setRequestHandler(
  gql`
    subscription {
      updateOpenTables
    }
  `,
  () => mockSubscription,
)

mockClient.setRequestHandler(
  tablesQuery,
  tablesQueryMock.mockResolvedValue({ data: { tables: [] } }),
)
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateTablesSubscriptionMock)
mockClient.setRequestHandler(inviteTableSubscription, () => inviteTableSubscriptionMock)
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

provideApolloClient(mockClient)

describe('IndexPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(IndexPage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  describe('without apollo error', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })

    it('title returns default title', () => {
      expect(title()).toBe('DreamMall')
    })

    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
