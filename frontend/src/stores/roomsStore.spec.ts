import { provideApolloClient } from '@vue/apollo-composable'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'

import { mockClient, openRoomsQueryMock } from '#tests/mock.apolloClient'

import { useRoomsStore } from './roomsStore'

provideApolloClient(mockClient)

describe('Rooms Store', () => {
  setActivePinia(createPinia())
  const roomsStore = useRoomsStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(roomsStore.rooms).toEqual([])
      expect(roomsStore.getRooms).toEqual([])
    })
  })

  describe('api', () => {
    it('calls the API', () => {
      expect(openRoomsQueryMock).toHaveBeenCalledTimes(1)
    })

    describe.skip('run timers', () => {
      beforeEach(() => {
        vi.useFakeTimers()
        // vi.clearAllMocks()
        vi.runAllTimers()
      })

      afterAll(() => {
        vi.useRealTimers()
      })

      it('calls the API again', () => {
        expect(openRoomsQueryMock).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('set rooms action', () => {
    it('updates the store', () => {
      roomsStore.setRooms([
        {
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
      expect(roomsStore.rooms).toEqual([
        {
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
