import { provideApolloClient } from '@vue/apollo-composable'
import { createMockClient } from 'mock-apollo-client'
import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { addSocialMediaMutation } from '#mutations/addSocialMediaMutation'
import { addUserDetailMutation } from '#mutations/addUserDetailMutation'
import { removeSocialMediaMutation } from '#mutations/removeSocialMediaMutation'
import { removeUserDetailMutation } from '#mutations/removeUserDetailMutation'
import { updateUserMutation } from '#mutations/updateUserMutation'
import { currentUserQuery } from '#queries/currentUserQuery'

import { useUserStore } from './userStore'

const mockClient = createMockClient()

const currentUserQueryMock = vi.fn()
const addUserDetailMock = vi.fn()
const addSocialMediaMock = vi.fn()
const removeUserDetailMock = vi.fn()
const removeSocialMediaMock = vi.fn()
const updateUserMutationMock = vi.fn()

mockClient.setRequestHandler(
  currentUserQuery,
  currentUserQueryMock.mockResolvedValue({
    data: {
      currentUser: {
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        table: null,
        availability: null,
        introduction: '',
        details: [{ id: 1, category: 'education', text: 'I am a student' }],
        social: [{ id: 1, type: 'instagram', link: 'https://instagram.com' }],
      },
    },
  }),
)

mockClient.setRequestHandler(updateUserMutation, updateUserMutationMock)

mockClient.setRequestHandler(addUserDetailMutation, addUserDetailMock)

mockClient.setRequestHandler(addSocialMediaMutation, addSocialMediaMock)

mockClient.setRequestHandler(removeUserDetailMutation, removeUserDetailMock.mockResolvedValue([]))

mockClient.setRequestHandler(removeSocialMediaMutation, removeSocialMediaMock.mockResolvedValue([]))

provideApolloClient(mockClient)

const setup = () => {
  setActivePinia(createPinia())
  const userStore = useUserStore()
  return userStore
}

describe('User Store', () => {
  describe('defaults', () => {
    const userStore = setup()
    it('has defaults set correctly', () => {
      expect(userStore.currentUser).toEqual({
        id: 666,
        name: 'Current User',
        table: null,
        username: 'currentUser',
        availability: null,
        introduction: '',
        details: [{ id: 1, category: 'education', text: 'I am a student' }],
        social: [{ id: 1, type: 'instagram', link: 'https://instagram.com' }],
      })
      expect(userStore.getCurrentUser).toEqual({
        id: 666,
        name: 'Current User',
        table: null,
        username: 'currentUser',
        availability: null,
        introduction: '',
        details: [{ id: 1, category: 'education', text: 'I am a student' }],
        social: [{ id: 1, type: 'instagram', link: 'https://instagram.com' }],
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
    const userStore = setup()
    it('queries the API', () => {
      const currentUserQueryMock = vi.fn()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = userStore.currentUser
      expect(currentUserQueryMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('set current user action', () => {
    const userStore = setup()
    beforeEach(() => {
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
    const updateUser = async (userStore: ReturnType<typeof setup>) => {
      updateUserMutationMock.mockResolvedValue({
        data: {
          updateUser: {
            id: 666,
            name: 'Updated Name',
            username: 'currentUser',
            table: null,
            availability: 'available',
            introduction: 'My introduction',
            details: [{ id: 1, category: 'education', text: 'I am a student' }],
            social: [{ id: 1, type: 'instagram', link: 'https://instagram.com' }],
          },
        },
      })
      await userStore.updateUser({
        name: 'Updated Name',
        introduction: 'My introduction',
        availability: 'available',
      })
    }

    it('updates the current user', async () => {
      const userStore = setup()
      await updateUser(userStore)
      expect(userStore.getCurrentUser).toEqual({
        id: 666,
        name: 'Updated Name',
        username: 'currentUser',
        introduction: 'My introduction',
        availability: 'available',
        details: [{ id: 1, category: 'education', text: 'I am a student' }],
        social: [{ id: 1, type: 'instagram', link: 'https://instagram.com' }],
        table: null,
      })
    })
  })

  describe('add user detail', () => {
    const userStore = setup()
    beforeEach(async () => {
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
        { id: 1, category: 'education', text: 'I am a student' },
        { id: 2, category: 'work', text: 'I am a developer' },
      ])
    })
  })

  describe('remove user detail', () => {
    const userStore = setup()
    beforeEach(async () => {
      await userStore.removeUserDetail(1)
    })

    it('removes a user detail', () => {
      expect(userStore.getCurrentUser?.details).toEqual([])
    })
  })

  describe('add social media account', () => {
    const userStore = setup()
    beforeEach(async () => {
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
        { id: 1, type: 'instagram', link: 'https://instagram.com' },
        { id: 4, type: 'twitter', link: 'https://twitter.com' },
      ])
    })
  })

  describe('remove social media account', () => {
    const userStore = setup()
    beforeEach(async () => {
      await userStore.removeSocialMedia(1)
    })

    it('removes a social media account', () => {
      expect(userStore.getCurrentUser?.social).toEqual([])
    })
  })
})
