import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { useAuthStore } from '#stores/authStore'

import UserInfo from './UserInfo.vue'

describe('UserInfo', () => {
  const authStore = useAuthStore()

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
    it('has no image and no text in avatar', () => {
      expect(wrapper.findComponent({ name: 'VAvatar' }).text()).toBe('')
      expect(
        wrapper.findComponent({ name: 'VAvatar' }).findComponent({ name: 'VImg' }).exists(),
      ).toBeFalsy()
    })
  })

  describe('username in store, but no image', () => {
    beforeEach(() => {
      authStore.save({
        access_token: 'access_token',
        profile: {
          aud: 'aud',
          sub: 'sub',
          exp: 1,
          iat: 1,
          iss: 'iss',
          name: 'Peter Lustig',
        },
        token_type: 'token_type',
        session_state: null,
        state: null,
        expires_at: new Date().valueOf() + 100,
        expires_in: 0,
        expired: false,
        scopes: ['email'],
        toStorageString: () => 'toStorageString',
      })
      wrapper = Wrapper()
    })

    it('has no image but initials in avatar', () => {
      expect(wrapper.findComponent({ name: 'VAvatar' }).text()).toBe('PL')
      expect(
        wrapper.findComponent({ name: 'VAvatar' }).findComponent({ name: 'VImg' }).exists(),
      ).toBeFalsy()
    })
  })

  describe('username and image in store', () => {
    beforeEach(() => {
      authStore.save({
        access_token: 'access_token',
        profile: {
          aud: 'aud',
          sub: 'sub',
          exp: 1,
          iat: 1,
          iss: 'iss',
          name: 'Peter Lustig',
          picture: 'http://url-to.me',
        },
        token_type: 'token_type',
        session_state: null,
        state: null,
        expires_at: new Date().valueOf() + 100,
        expires_in: 0,
        expired: false,
        scopes: ['email'],
        toStorageString: () => 'toStorageString',
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
