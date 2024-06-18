import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'
import { authService } from '#tests/mock.authService'

import TopMenu from './TopMenu.vue'
import UserDropdown from './UserDropdown.vue'

describe('TopMenu', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TopMenu),
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

  describe('signout button', () => {
    const authStore = useAuthStore()

    const authServiceSpy = vi.spyOn(authService, 'signOut')
    const storeSpy = vi.spyOn(authStore, 'clear')

    beforeEach(() => {
      vi.clearAllMocks()
      authStore.save({
        access_token: 'access_token',
        profile: {
          aud: 'aud',
          sub: 'sub',
          exp: 1,
          iat: 1,
          iss: 'iss',
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

    describe('without error', () => {
      beforeEach(async () => {
        await wrapper.find('button.user-info').trigger('click')
        await flushPromises()
        await wrapper.findComponent(UserDropdown).find('button.sign-out').trigger('click')
      })

      it('calls auth service sign out', () => {
        expect(authServiceSpy).toBeCalled()
      })

      it('clears the store', () => {
        expect(storeSpy).toBeCalled()
      })
    })

    describe('with error', () => {
      const consoleSpy = vi.spyOn(console, 'error')

      beforeEach(async () => {
        authServiceSpy.mockRejectedValue('Error!')
        await wrapper.find('button.user-info').trigger('click')
        await flushPromises()
        await wrapper.findComponent(UserDropdown).find('button.sign-out').trigger('click')
      })

      it('logs the error', () => {
        expect(consoleSpy).toBeCalledWith('error: auth error', 'Error!')
      })
    })
  })

  describe('admin button', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })
    describe('button visibility', () => {
      const authStore = useAuthStore()

      beforeEach(async () => {
        await wrapper.find('button.user-info').trigger('click')
        await flushPromises()
      })

      describe('as normal user', () => {
        it('does not exist', () => {
          expect(wrapper.findComponent(UserDropdown).find('button.admin-button').exists()).toBe(
            false,
          )
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
          expect(wrapper.findComponent(UserDropdown).find('button.admin-button').exists()).toBe(
            true,
          )
        })

        describe('click', () => {
          beforeEach(async () => {
            await wrapper.findComponent(UserDropdown).find('button.admin-button').trigger('click')
          })

          it('redirects to admin url', () => {
            expect(global.window.location.href).toBe('https://url-to-admin.com/')
          })
        })
      })
    })
  })
})
