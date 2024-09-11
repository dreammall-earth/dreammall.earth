import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { describe, expect, it, vi } from 'vitest'

import { currentUserQuery } from '#queries/currentUserQuery'
import { tablesQuery } from '#queries/tablesQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import MyTables from './MyTables.vue'

const currentUserQueryMock = vi.fn()
const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()
const tablesQueryMock = vi.fn()

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

mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)

mockClient.setRequestHandler(
  tablesQuery,
  tablesQueryMock.mockResolvedValue({
    data: {
      tables: [
        {
          name: 'My Table',
          public: false,
          users: [
            {
              name: 'Current User',
              username: 'currentUser',
              role: 'MODERATOR',
            },
            {
              name: 'Bibi Bloxberg',
              username: 'bibi',
              role: 'VIEWER',
            },
            {
              name: 'Peter Lustig',
              username: 'peter',
              role: 'VIEWER',
            },
          ],
        },
      ],
    },
  }),
)

provideApolloClient(mockClient)

describe('MyTables', () => {
  const Wrapper = (props = {}) =>
    mount(MyTables, {
      props,
    })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })
})
