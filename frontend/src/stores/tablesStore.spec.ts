import { provideApolloClient } from '@vue/apollo-composable'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { openTablesQuery } from '#src/graphql/queries/openTablesQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import { useTablesStore } from './tablesStore'

const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()
const mockClient = createMockClient()
const openTablesQueryMock = vi.fn()
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)
mockClient.setRequestHandler(
  openTablesQuery,
  openTablesQueryMock.mockResolvedValue({ data: { openTables: [] } }),
)

provideApolloClient(mockClient)

describe('Tables Store', () => {
  setActivePinia(createPinia())
  const tablesStore = useTablesStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(tablesStore.tables).toEqual([])
      expect(tablesStore.getTables).toEqual([])
    })
  })

  describe('api', () => {
    it('queries the API', () => {
      expect(openTablesQueryMock).toHaveBeenCalledTimes(1)
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
      tablesStore.setTables([
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
      expect(tablesStore.tables).toEqual([
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
