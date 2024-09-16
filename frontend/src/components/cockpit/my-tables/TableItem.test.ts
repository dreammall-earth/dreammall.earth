import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { navigate } from 'vike/client/router'
import { describe, expect, it, vi } from 'vitest'

import { currentUserQuery } from '#src/graphql/queries/currentUserQuery'
import { tablesQuery } from '#src/graphql/queries/tablesQuery'
import { updateOpenTablesSubscription } from '#src/graphql/subscriptions/updateOpenTablesSubscription'

import TableItem from './TableItem.vue'

vi.mock('vike/client/router')

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
          id: 1,
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

describe('Table Item', () => {
  const Wrapper = (
    props = {
      id: 1,
      name: 'Table Name',
      memberCount: 4,
    },
  ) =>
    mount(TableItem, {
      props,
    })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('camera icon', () => {
    it('navigates to table page when clicked', async () => {
      const wrapper = Wrapper()
      await wrapper.find('.camera-icon').trigger('click')
      expect(navigate).toHaveBeenCalledWith('/table/1')
    })
  })

  describe('options button', () => {
    it('opens options when clicked', async () => {
      const wrapper = Wrapper()
      await wrapper.find('button.options').trigger('click')
    })
  })
})
