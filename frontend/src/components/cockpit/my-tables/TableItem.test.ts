import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { navigate } from 'vike/client/router'
import { describe, expect, it, vi } from 'vitest'

import { currentUserQuery } from '#queries/currentUserQuery'
import { projectTablesQuery } from '#queries/projectTablesQuery'
import { inviteTableSubscription } from '#subscriptions/inviteTableSubscription'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import TableItem from './TableItem.vue'

vi.mock('vike/client/router')

const currentUserQueryMock = vi.fn()
const updateTablesSubscriptionMock: IMockSubscription = createMockSubscription()
const inviteTableSubscriptionMock: IMockSubscription = createMockSubscription()
const projectTablesQueryMock = vi.fn()

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

mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateTablesSubscriptionMock)
mockClient.setRequestHandler(inviteTableSubscription, () => inviteTableSubscriptionMock)

mockClient.setRequestHandler(
  projectTablesQuery,
  projectTablesQueryMock.mockResolvedValue({
    data: {
      projectTables: [
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

  describe('join-table-icon', () => {
    it('navigates to table page when clicked', async () => {
      const wrapper = Wrapper()
      await wrapper.find('.join-table-icon').trigger('click')
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
