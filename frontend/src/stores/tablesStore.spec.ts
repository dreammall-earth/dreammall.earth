import { provideApolloClient } from '@vue/apollo-composable'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { tablesQuery } from '#queries/tablesQuery'
import { inviteTableSubscription } from '#subscriptions/inviteTableSubscription'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import { useTablesStore } from './tablesStore'

const updateTablesSubscriptionMock: IMockSubscription = createMockSubscription()
const inviteTableSubscriptionMock: IMockSubscription = createMockSubscription()
const mockClient = createMockClient()
const tablesQueryMock = vi.fn()
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateTablesSubscriptionMock)
mockClient.setRequestHandler(inviteTableSubscription, () => inviteTableSubscriptionMock)
mockClient.setRequestHandler(
  tablesQuery,
  tablesQueryMock.mockResolvedValue({
    data: {
      tables: {
        mallTalkTables: [],
        permanentTables: [],
        projectTables: [],
      },
    },
  }),
)

provideApolloClient(mockClient)

describe('Tables Store', () => {
  setActivePinia(createPinia())
  const tablesStore = useTablesStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(tablesStore.openTables).toEqual({
        permanentTables: [],
        mallTalkTables: [],
        projectTables: [],
      })
      expect(tablesStore.getTables).toEqual({
        permanentTables: [],
        mallTalkTables: [],
        projectTables: [],
      })
    })
  })

  describe('api', () => {
    it('queries the API', () => {
      expect(tablesQueryMock).toHaveBeenCalledTimes(1)
    })

    describe('subscription', () => {
      beforeEach(() => {
        updateTablesSubscriptionMock.next({
          data: {
            updateOpenTables: {
              permanentTables: [
                {
                  id: 69,
                  meetingID: 'my-meeting',
                  meetingName: 'My meeting',
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
              mallTalkTables: [],
              projectTables: [],
            },
          },
        })
      })

      it('updates the store', () => {
        expect(tablesStore.getTables).toEqual({
          permanentTables: [
            {
              id: 69,
              meetingID: 'my-meeting',
              meetingName: 'My meeting',
              isModerator: true,
              startTime: '1234',
              participantCount: 1,
              type: 'PERMANENT',
              attendees: [
                {
                  fullName: 'Peter Lustig',
                },
              ],
            },
          ],
          mallTalkTables: [],
          projectTables: [],
        })
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
      expect(tablesStore.openTables).toEqual({
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
    })
  })
})
