import { createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { openTablesQuery } from '#queries/openTablesQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'
import { setupMockClient } from '#tests/mock.apolloClient'

import { useTablesStore } from './tablesStore'

const setup = () => {
  const mockClient = setupMockClient()
  const openTablesQueryMock = vi.fn()
  const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()
  mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)
  mockClient.setRequestHandler(openTablesQuery, openTablesQueryMock)

  setActivePinia(createPinia())
  const tablesStore = useTablesStore()

  return { tablesStore, openTablesQueryMock, updateOpenTablesSubscriptionMock }
}

const mockOpenTablesQuery = (
  openTablesQueryMock: ReturnType<typeof vi.fn> = vi.fn(),
  value = { data: { openTables: [] } },
) => {
  openTablesQueryMock.mockResolvedValue(value)

  return { openTablesQueryMock }
}

describe('Tables Store', () => {
  describe('defaults', () => {
    it('has defaults set correctly', () => {
      const { tablesStore, openTablesQueryMock } = setup()
      mockOpenTablesQuery(openTablesQueryMock)
      expect(tablesStore.tables).toEqual([])
      expect(tablesStore.getTables).toEqual([])
    })
  })

  describe('api', () => {
    it('queries the API', () => {
      const { tablesStore, openTablesQueryMock } = setup()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const unused = tablesStore.tables
      expect(openTablesQueryMock).toHaveBeenCalledTimes(1)
    })

    describe('subscription', () => {
      const { tablesStore, updateOpenTablesSubscriptionMock } = setup()

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
      const { tablesStore } = setup()
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
