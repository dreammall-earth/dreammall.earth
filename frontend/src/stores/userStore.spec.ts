import { provideApolloClient } from '@vue/apollo-composable'
import { createMockClient } from 'mock-apollo-client'
import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeAll } from 'vitest'

import { currentUserQuery } from '#queries/currentUserQuery'

import { useUserStore } from './userStore'

const mockClient = createMockClient()

const currentUserQueryMock = vi.fn()

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
