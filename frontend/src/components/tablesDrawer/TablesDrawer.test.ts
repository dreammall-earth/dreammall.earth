import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { tablesQuery } from '#queries/tablesQuery'
import { callSubscription } from '#subscriptions/callSubscription'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import TablesDrawer from './TablesDrawer.vue'

export const mockClient = createMockClient()

const tablesQueryMock = vi.fn()
const updateTablesSubscriptionMock: IMockSubscription = createMockSubscription()
const inviteTableSubscriptionMock: IMockSubscription = createMockSubscription()

mockClient.setRequestHandler(
  tablesQuery,
  tablesQueryMock.mockResolvedValue({
    data: {
      tables: {
        permanentTables: [
          {
            id: 77,
            meetingID: 'my-meeting',
            meetingName: 'my meeting',
            type: 'PERMANENT',
            isModerator: true,
            startTime: '1234',
            participantCount: 1,
            attendees: [
              {
                fullName: 'Peter Lustig',
              },
            ],
          },
        ],
        mallTalkTables: [
          {
            id: 77,
            meetingID: 'my-meeting',
            meetingName: 'my meeting',
            type: 'MALL_TALK',
            isModerator: false,
            startTime: '1234',
            participantCount: 1,
            attendees: [
              {
                fullName: 'Peter Lustig',
              },
            ],
          },
        ],
        projectTables: [
          {
            id: 77,
            meetingID: 'my-meeting',
            meetingName: 'my meeting',
            type: 'PROJECT',
            isModerator: true,
            startTime: '1234',
            participantCount: 1,
            attendees: [
              {
                fullName: 'Peter Lustig',
              },
            ],
          },
        ],
      },
    },
  }),
)
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateTablesSubscriptionMock)
mockClient.setRequestHandler(callSubscription, () => inviteTableSubscriptionMock)

provideApolloClient(mockClient)

describe('TablesDrawer', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TablesDrawer as Component, { drawer: true }),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
