import { provideApolloClient } from '@vue/apollo-composable'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'

import {
  mockClient,
  openTablesQueryMock,
  updateOpenTablesSubscriptionMock,
} from '#tests/mock.apolloClient'

import { useTablesStore } from './tablesStore'

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
                joinLink: 'https://my.link',
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
            joinLink: 'https://my.link',
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
          joinLink: 'https://my.link',
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
          joinLink: 'https://my.link',
        },
      ])
    })
  })
})
