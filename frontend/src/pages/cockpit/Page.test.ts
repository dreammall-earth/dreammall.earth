import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { gql } from 'graphql-tag'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { currentUserQuery } from '#queries/currentUserQuery'
import { tablesQuery } from '#queries/tablesQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import CockpitPage from './+Page.vue'
import { title } from './+title'

const tablesQueryMock = vi.fn()
const mockSubscription: IMockSubscription = createMockSubscription()
const currentUserQueryMock = vi.fn()
const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()

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
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)
mockClient.setRequestHandler(
  currentUserQuery,
  currentUserQueryMock.mockResolvedValue({
    data: {
      currentUser: {
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        availability: 'available',
        introduction: 'Hello, I am the current user',
        details: [{ id: 1, category: 'education', text: 'I am a student' }],
        social: [{ id: 1, type: 'instagram', link: 'https://instagram.com' }],
        table: null,
      },
    },
  }),
)

provideApolloClient(mockClient)

describe('Cockpit Page', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(CockpitPage as Component),
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
