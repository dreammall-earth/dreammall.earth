import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi } from 'vitest'

import { currentUserQuery } from '#queries/currentUserQuery'
import { setupMockClient } from '#tests/mock.apolloClient'

import { useUserStore } from './userStore'

const setup = () => {
  const mockClient = setupMockClient()

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

  setActivePinia(createPinia())
  const userStore = useUserStore()

  currentUserQueryMock.mockResolvedValue({
    data: {
      currentUser: {
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        table: null,
      },
    },
  })

  return { userStore, currentUserQueryMock }
}

describe('User Store', () => {
  describe('defaults', () => {
    it('has defaults set correctly', () => {
      const { userStore } = setup()
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
      const { userStore } = setup()
      expect(userStore.getCurrentUserInitials).toBe('CU')
      expect(userStore.getCurrentUserAvatar).toBeUndefined()
      expect(userStore.getMyTable).toBeNull()
      expect(userStore.getUsersInMyTable).toBeUndefined()
    })
  })

  describe('api', () => {
    it('queries the API', () => {
      const { userStore, currentUserQueryMock } = setup()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const unused = userStore.getCurrentUser
      expect(currentUserQueryMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('set current user action', () => {
    const setCurrentUser = (userStore: ReturnType<typeof useUserStore>) => {
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
    }

    it('updates current user', () => {
      const { userStore } = setup()
      setCurrentUser(userStore)
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
      const { userStore } = setup()
      setCurrentUser(userStore)
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
      const { userStore } = setup()
      setCurrentUser(userStore)
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
