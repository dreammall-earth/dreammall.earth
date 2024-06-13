import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'

import IndexPage from './+Page.vue'
import { title } from './+title'

describe('IndexPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(IndexPage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('title returns default title', () => {
    expect(title()).toBe('DreamMall')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('room button', () => {
    beforeEach(async () => {
      await wrapper.find('button.room-button').trigger('click')
    })

    it('opens room page', () => {
      expect(document.location.pathname).toBe('/room')
    })
  })

  describe('admin button', () => {
    const authStore = useAuthStore()

    describe('as normal user', () => {
      it('does not exist', () => {
        expect(wrapper.find('button.admin-button').exists()).toBe(false)
      })
    })

    describe('as admin user', () => {
      beforeEach(() => {
        AUTH.ADMIN_GROUP = 'ADMIN_GROUP'
        AUTH.ADMIN_REDIRECT_URI = 'https://url-to-admin.com'
        authStore.save({
          access_token: 'access_token',
          profile: {
            aud: 'aud',
            sub: 'sub',
            exp: 1,
            iat: 1,
            iss: 'iss',
            groups: ['ADMIN_GROUP'],
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
      })

      it('exists', () => {
        expect(wrapper.find('button.admin-button').exists()).toBe(true)
      })

      describe('click', () => {
        beforeEach(async () => {
          await wrapper.find('button.admin-button').trigger('click')
        })

        it('redirects to admin url', () => {
          expect(global.window.location.href).toBe('https://url-to-admin.com/')
        })
      })
    })
  })

  describe('with error', () => {
    const authStore = useAuthStore()

    describe('as admin user', () => {
      beforeEach(() => {
        AUTH.ADMIN_GROUP = 'ADMIN_GROUP'
        AUTH.ADMIN_REDIRECT_URI = 'https://url-to-admin.com'
        authStore.save({
          access_token: 'access_token',
          profile: {
            aud: 'aud',
            sub: 'sub',
            exp: 1,
            iat: 1,
            iss: 'iss',
            groups: ['ADMIN_GROUP'],
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
      })

      it('exists', () => {
        expect(wrapper.find('button.admin-button').exists()).toBe(true)
      })

      describe('click', () => {
        beforeEach(async () => {
          await wrapper.find('button.admin-button').trigger('click')
        })

        it('redirects to admin url', () => {
          expect(global.window.location.href).toBe('https://url-to-admin.com/')
        })
      })
    })
  })
})
