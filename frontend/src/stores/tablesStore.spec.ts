import { provideApolloClient } from '@vue/apollo-composable'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { tablesQuery } from '#queries/tablesQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import { useTablesStore } from './tablesStore'

const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()
const mockClient = createMockClient()
const tablesQueryMock = vi.fn()
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)
mockClient.setRequestHandler(
  tablesQuery,
  tablesQueryMock.mockResolvedValue({ data: { tables: [] } }),
)

provideApolloClient(mockClient)

describe('Tables Store', () => {
  setActivePinia(createPinia())
  const tablesStore = useTablesStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(tablesStore.openTables).toEqual([])
      expect(tablesStore.getTables).toEqual([])
    })
  })

  describe('api', () => {
    it('queries the API', () => {
      expect(tablesQueryMock).toHaveBeenCalledTimes(1)
    })

    describe('subscription', () => {
      beforeEach(() => {
        updateOpenTablesSubscriptionMock.next({
          data: {
            updateOpenTables: [
              {
                id: 69,
                meetingID: 'my-meeting',
                meetingName: 'My meeting',
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
        })
      })

      it('updates the store', () => {
        expect(tablesStore.getTables).toEqual([
          {
            id: 69,
            meetingID: 'my-meeting',
            meetingName: 'My meeting',
            startTime: '1234',
            participantCount: 1,
            attendees: [
              {
                fullName: 'Peter Lustig',
              },
            ],
          },
        ])
      })
    })
  })

  describe('set tables action', () => {
    it('updates the store', () => {
      tablesStore.setTables({
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
      })
      expect(tablesStore.openTables).toEqual([
        {
          id: 77,
          meetingID: 'my-meeting',
          meetingName: 'my meeting',
          startTime: '1234',
          participantCount: 1,
          attendees: [
            {
              fullName: 'Peter Lustig',
            },
          ],
        },
      ])
    })
  })
})
