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
        table: null,
        username: 'currentUser',
      })
      expect(userStore.getCurrentUser).toEqual({
        id: 666,
        name: 'Current User',
        table: null,
        username: 'currentUser',
      })
    })

    it('has computed getters set correctly', () => {
      expect(userStore.getCurrentUserInitials).toBe('CU')
      expect(userStore.getCurrentUserAvatar).toBeUndefined()
      expect(userStore.getMyTable).toBeNull()
      expect(userStore.getUsersInMyTable).toBeUndefined()
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
        table: {
          id: 1234,
          name: 'My Table',
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
        table: {
          id: 1234,
          name: 'My Table',
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
      expect(userStore.getMyTable).toEqual({
        id: 1234,
        name: 'My Table',
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
      expect(userStore.getUsersInMyTable).toEqual([
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
