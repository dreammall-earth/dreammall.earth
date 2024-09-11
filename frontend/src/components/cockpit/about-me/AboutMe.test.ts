import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { describe, expect, it, vi } from 'vitest'

import { currentUserQuery } from '#queries/currentUserQuery'
import { SocialMedia, UserDetail, useUserStore } from '#stores/userStore'

import AboutMe from './AboutMe.vue'

const currentUserQueryMock = vi.fn()

const mockClient = createMockClient()

mockClient.setRequestHandler(
  currentUserQuery,
  currentUserQueryMock.mockResolvedValue({
    data: {
      currentUser: {
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        availability: 'available',
        introduction: 'Hello, I am the current user',
        details: [
          { id: 1, category: 'education', text: 'I am a student' },
          { id: 2, category: 'work', text: 'I am a worker' },
          { id: 3, category: 'work', text: 'I really like my job' },
          { id: 4, category: 'language', text: 'English' },
          { id: 5, category: 'place', text: 'Berlin' },
          { id: 6, category: 'feeling', text: 'Yeah!' },
        ] as UserDetail[],
        social: [
          {
            id: 1,
            type: 'instagram',
            link: 'https://instagram.com',
          },
          {
            id: 2,
            type: 'facebook',
            link: 'https://facebook.com',
          },
          {
            id: 3,
            type: 'linkedin',
            link: 'https://linkedin.com',
          },
          {
            id: 4,
            type: 'x',
            link: 'https://x.com',
          },
          {
            id: 5,
            type: 'xing',
            link: 'https://xing.com',
          },
          { id: 6, type: 'discord', link: 'https://discord.com' },
          { id: 7, type: 'telegram', link: 'https://t.me' },
          { id: 8, type: 'snapchat', link: 'https://snapchat.com' },
          { id: 9, type: 'reddit', link: 'https://reddit.com' },
          { id: 10, type: 'whatsapp', link: 'https://wa.me' },
          { id: 11, type: 'pintarest', link: 'https://pinterest.com' },
          { id: 12, type: 'linkedin', link: 'https://linkedin.com' },
        ] as SocialMedia[],
      },
    },
  }),
)

provideApolloClient(mockClient)

const setCurrentUser = (store: ReturnType<typeof useUserStore>) => {
  store.currentUser = {
    id: 666,
    referenceId: 'UQV6KSVD',
    name: 'Current User',
    username: 'currentUser',
    availability: 'available',
    introduction: 'Hello, I am the current user',
    details: [
      { id: 1, category: 'education', text: 'I am a student' },
      { id: 2, category: 'work', text: 'I am a worker' },
      { id: 3, category: 'work', text: 'I really like my job' },
      { id: 4, category: 'language', text: 'English' },
      { id: 5, category: 'place', text: 'Berlin' },
      { id: 6, category: 'feeling', text: 'Yeah!' },
    ] as UserDetail[],
    social: [
      {
        id: 1,
        type: 'instagram',
        link: 'https://instagram.com',
      },
      {
        id: 2,
        type: 'facebook',
        link: 'https://facebook.com',
      },
      {
        id: 3,
        type: 'linkedin',
        link: 'https://linkedin.com',
      },
      {
        id: 4,
        type: 'x',
        link: 'https://x.com',
      },
      {
        id: 5,
        type: 'xing',
        link: 'https://xing.com',
      },
      { id: 6, type: 'discord', link: 'https://discord.com' },
      { id: 7, type: 'telegram', link: 'https://t.me' },
      { id: 8, type: 'snapchat', link: 'https://snapchat.com' },
      { id: 9, type: 'reddit', link: 'https://reddit.com' },
      { id: 10, type: 'whatsapp', link: 'https://wa.me' },
      { id: 11, type: 'pintarest', link: 'https://pinterest.com' },
      { id: 12, type: 'linkedin', link: 'https://linkedin.com' },
    ] as SocialMedia[],
  }
}

describe('AboutMe', () => {
  const Wrapper = (props = {}) =>
    mount(AboutMe, {
      props,
    })

  it('renders', () => {
    const wrapper = Wrapper()
    const userStore = useUserStore()
    setCurrentUser(userStore)
    expect(wrapper.element).toMatchSnapshot()
  })

  /*
  it('updates User with new availability', () => {
    const wrapper = Wrapper()
    const userStore = useUserStore()
    setCurrentUser(userStore)
    const aboutMeView = wrapper.getComponent(AboutMeView)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    aboutMeView.vm.$emit('update-availability', 'busy')

    expect(userStore.updateUser).toHaveBeenCalledWith({
      name: 'Current User',
      availability: 'busy',
    })
  }) */
})
