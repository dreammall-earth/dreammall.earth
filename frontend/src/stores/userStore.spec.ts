import { provideApolloClient } from '@vue/apollo-composable'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeAll } from 'vitest'

import { mockClient, currentUserQueryMock } from '#tests/mock.apolloClient'

import { useUserStore } from './userStore'

provideApolloClient(mockClient)

describe('User Store', () => {
  setActivePinia(createPinia())
  const userStore = useUserStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(userStore.currentUser).toEqual({
        id: 666,
        name: 'Current User',
        room: null,
        username: 'currentUser',
      })
      expect(userStore.getCurrentUser).toEqual({
        id: 666,
        name: 'Current User',
        room: null,
        username: 'currentUser',
      })
    })

    it('has computed getters set correctly', () => {
      expect(userStore.getCurrentUserInitials).toBe('CU')
      expect(userStore.getCurrentUserAvatar).toBeUndefined()
      expect(userStore.getMyRoom).toBeNull()
      expect(userStore.getUsersInMyRoom).toBeUndefined()
    })
  })

  describe('api', () => {
    it('queries the API', () => {
      expect(currentUserQueryMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('set current user action', () => {
    beforeAll(() => {
      userStore.setCurrentUser({
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        room: {
          id: 1234,
          name: 'My Room',
          public: false,
          users: [
            {
              id: 333,
              role: 'VIEWER',
              name: 'Peter Lustig',
              username: 'peter',
            },
            {
              id: 77,
              role: 'VIEWER',
              name: 'Bibi Bloxberg',
              username: 'bibi',
            },
          ],
        },
      })
    })

    it('updates current user', () => {
      expect(userStore.getCurrentUser).toEqual({
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        room: {
          id: 1234,
          name: 'My Room',
          public: false,
          users: [
            {
              id: 333,
              role: 'VIEWER',
              name: 'Peter Lustig',
              username: 'peter',
            },
            {
              id: 77,
              role: 'VIEWER',
              name: 'Bibi Bloxberg',
              username: 'bibi',
            },
          ],
        },
      })
    })

    it('updates my room', () => {
      expect(userStore.getMyRoom).toEqual({
        id: 1234,
        name: 'My Room',
        public: false,
        users: [
          {
            id: 333,
            role: 'VIEWER',
            name: 'Peter Lustig',
            username: 'peter',
          },
          {
            id: 77,
            role: 'VIEWER',
            name: 'Bibi Bloxberg',
            username: 'bibi',
          },
        ],
      })
    })

    it('updates users in my room', () => {
      expect(userStore.getUsersInMyRoom).toEqual([
        {
          id: 333,
          role: 'VIEWER',
          name: 'Peter Lustig',
          username: 'peter',
        },
        {
          id: 77,
          role: 'VIEWER',
          name: 'Bibi Bloxberg',
          username: 'bibi',
        },
      ])
    })
  })
})
