import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { currentUserQuery } from '#queries/currentUserQuery'
import { useUserStore } from '#stores/userStore'

import UserInfo from './UserInfo.vue'

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

describe('UserInfo', () => {
  const userStore = useUserStore()

  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(UserInfo as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('no user name in store', () => {
    beforeEach(() => {
      userStore.setCurrentUser({
        name: '',
        username: '',
        id: 22,
        availability: null,
        details: [],
        social: [],
      })
    })

    it('has no image and no text in avatar', () => {
      expect(wrapper.findComponent({ name: 'VAvatar' }).text()).toBe('')
      expect(
        wrapper.findComponent({ name: 'VAvatar' }).findComponent({ name: 'VImg' }).exists(),
      ).toBe(false)
    })
  })

  describe('username in store, but no image', () => {
    beforeEach(() => {
      userStore.setCurrentUser({
        name: 'Peter Lustig',
        username: 'peter',
        id: 22,
        availability: null,
        details: [],
        social: [],
      })
    })

    it('has no image but initials in avatar', () => {
      expect(wrapper.findComponent({ name: 'VAvatar' }).text()).toBe('PL')
      expect(
        wrapper.findComponent({ name: 'VAvatar' }).findComponent({ name: 'VImg' }).exists(),
      ).toBe(false)
    })
  })

  describe('username and image in store', () => {
    beforeEach(() => {
      userStore.setCurrentUser({
        name: 'Peter Lustig',
        username: 'peter',
        id: 22,
        avatar: 'http://url-to.me',
        availability: null,
        details: [],
        social: [],
      })
    })

    it('has image and not text in avatar', () => {
      expect(wrapper.findComponent({ name: 'VAvatar' }).text()).toBe('')
      expect(
        wrapper.findComponent({ name: 'VAvatar' }).findComponent({ name: 'VImg' }).exists(),
      ).toBe(true)
    })
  })
})
