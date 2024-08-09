import { provideApolloClient } from '@vue/apollo-composable'
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeAll } from 'vitest'

import {
  mockClient,
  currentUserQueryMock,
  updateUserMutationMock,
  addUserDetailMock,
  addSocialMediaMock,
} from '#tests/mock.apolloClient'

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
        availability: null,
        introduction: '',
        details: [],
        social: [],
      })
      expect(userStore.getCurrentUser).toEqual({
        id: 666,
        name: 'Current User',
        table: null,
        username: 'currentUser',
        availability: null,
        introduction: '',
        details: [],
        social: [],
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
        introduction: 'Hello, I am the current user',
        availability: 'available',
        details: [{ id: 1, category: 'education', text: 'I am a student' }],
        social: [{ id: 1, type: 'instagram', link: 'https://instagram.com' }],
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
        introduction: 'Hello, I am the current user',
        availability: 'available',
        details: [{ id: 1, category: 'education', text: 'I am a student' }],
        social: [{ id: 1, type: 'instagram', link: 'https://instagram.com' }],
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

  describe('update user', () => {
    beforeAll(async () => {
      updateUserMutationMock.mockResolvedValue({
        data: {
          updateUser: {
            id: 666,
            name: 'Updated Name',
            username: 'currentUser',
            table: null,
            availability: 'available',
            introduction: 'My introduction',
            details: [],
            social: [],
          },
        },
      })
      await userStore.updateUser({
        name: 'Updated Name',
        introduction: 'My introduction',
        availability: 'available',
      })
    })

    it('updates the current user', () => {
      expect(userStore.getCurrentUser).toEqual({
        id: 666,
        name: 'Updated Name',
        username: 'currentUser',
        introduction: 'My introduction',
        availability: 'available',
        details: [],
        social: [],
        table: null,
      })
    })

    describe('add user detail', () => {
      beforeAll(async () => {
        addUserDetailMock.mockResolvedValue({
          data: {
            addUserDetail: {
              id: 2,
              category: 'work',
              text: 'I am a developer',
            },
          },
        })
        await userStore.addUserDetail({
          text: 'I am a developer',
          category: 'work',
        })
      })

      it('adds a user detail', () => {
        expect(userStore.getCurrentUser?.details).toEqual([
          { id: 2, category: 'work', text: 'I am a developer' },
        ])
      })
    })

    describe('remove user detail', () => {
      beforeAll(async () => {
        await userStore.removeUserDetail(2)
      })

      it('removes a user detail', () => {
        expect(userStore.getCurrentUser?.details).toEqual([])
      })
    })

    describe('add social media account', () => {
      beforeAll(async () => {
        addSocialMediaMock.mockResolvedValue({
          data: {
            addSocialMedia: {
              id: 4,
              type: 'twitter',
              link: 'https://twitter.com',
            },
          },
        })

        await userStore.addSocialMedia({
          type: 'twitter',
          link: 'https://twitter.com',
        })
      })

      it('adds a social media account', () => {
        expect(userStore.getCurrentUser?.social).toEqual([
          { id: 4, type: 'twitter', link: 'https://twitter.com' },
        ])
      })
    })

    describe('remove social media account', () => {
      beforeAll(async () => {
        await userStore.removeSocialMedia(4)
      })

      it('removes a social media account', () => {
        expect(userStore.getCurrentUser?.social).toEqual([])
      })
    })
  })
})
