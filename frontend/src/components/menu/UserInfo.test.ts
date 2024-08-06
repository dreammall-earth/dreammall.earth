import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { useUserStore } from '#stores/userStore'
import { mockClient } from '#tests/mock.apolloClient'

import UserInfo from './UserInfo.vue'

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

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('no user name in store', () => {
    beforeEach(() => {
      userStore.setCurrentUser({
        name: '',
        username: '',
        id: 22,
      })
      wrapper = Wrapper()
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
      })
      wrapper = Wrapper()
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
      })
      wrapper = Wrapper()
    })

    it('has image and not text in avatar', () => {
      expect(wrapper.findComponent({ name: 'VAvatar' }).text()).toBe('')
      expect(
        wrapper.findComponent({ name: 'VAvatar' }).findComponent({ name: 'VImg' }).exists(),
      ).toBe(true)
    })
  })
})
