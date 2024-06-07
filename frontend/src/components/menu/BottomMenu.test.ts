import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import BottomMenu from './BottomMenu.vue'
import Circle from './CircleElement.vue'
import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'

describe('BottomMenu', () => {
  let wrapper: VueWrapper<any>
  let toggleDrawer: ReturnType<typeof vi.fn>

  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(BottomMenu),
      },
    })
  }

  beforeEach(() => {
    toggleDrawer = vi.fn()
    wrapper = mount(BottomMenu, {
      global: {
        mocks: {
          toggleDrawer,
        },
      },
    })
  })

  it('renders BottomMenu', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('toggles drawer on Circle click', async () => {
    await wrapper.findComponent(Circle).trigger('click')
    expect(toggleDrawer).toHaveBeenCalled()
    await flushPromises()
    expect(wrapper.findComponent(ListWithNavigationDrawer).props('drawer')).toBe(true)
  })

  it('passes location prop to ListWithNavigationDrawer', () => {
    const listWithNavigationDrawer = wrapper.findComponent(ListWithNavigationDrawer)
    expect(listWithNavigationDrawer.props('location')).toBe('bottom')
  })

  describe('signout button', () => {
    // Mocking authStore and authService
    const authStore = {
      save: vi.fn(),
      clear: vi.fn(),
    }

    const authService = {
      signOut: vi.fn().mockResolvedValue('signed out'),
    }

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
        await wrapper.find('button.sign-out').trigger('click')
      })

      it('calls auth service sign out', () => {
        expect(authServiceSpy).toBeCalled()
      })

      it('clears the store', () => {
        expect(storeSpy).toBeCalled()
      })
    })

    describe('with error', () => {
      const consoleSpy = vi.spyOn(console, 'log')

      beforeEach(async () => {
        authServiceSpy.mockRejectedValue('Error!')
        await wrapper.find('button.user-info').trigger('click')
        await flushPromises()
        await wrapper.find('button.sign-out').trigger('click')
      })

      it('logs the error', () => {
        expect(consoleSpy).toBeCalledWith('auth error', 'Error!')
      })
    })
  })
})
