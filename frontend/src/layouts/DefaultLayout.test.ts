import { ApolloError } from '@apollo/client/errors'
import { flushPromises, mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { beforeEach, expect, describe, it, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import UserDropdown from '#components/menu/UserDropdown.vue'
import { joinMyTableMutation } from '#mutations/joinMyTableMutation'
import { AUTH } from '#src/env'
import { useActiveTableStore } from '#stores/activeTableStore'
import { useAuthStore } from '#stores/authStore'
import { mockClient } from '#tests/mock.apolloClient'
import { authService } from '#tests/mock.authService'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import DefaultLayout from './DefaultLayout.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const joinMyTableMutationMock = vi.fn()

mockClient.setRequestHandler(joinMyTableMutation, joinMyTableMutationMock)

const activeTableStore = useActiveTableStore()

describe('DefaultLayout', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(DefaultLayout as Component),
      },
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  describe('new table button - mobile', () => {
    beforeEach(() => {
      // setViewport(375, 667) // Set to mobile viewport
      wrapper = Wrapper()
    })

    describe('enter table', () => {
      describe('apollo with success', () => {
        beforeEach(async () => {
          vi.clearAllMocks()
          joinMyTableMutationMock.mockResolvedValue({
            data: {
              joinMyTable: 'http://link-to-my.table',
            },
          })
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyTableMutationMock).toHaveBeenCalled()
        })

        it('updates the store', () => {
          expect(activeTableStore.activeTable).toBe('http://link-to-my.table')
        })

        it('navigates to table page', async () => {
          await flushPromises()
          expect(navigate).toHaveBeenCalledWith('/table/')
        })
      })

      describe('apollo with no data', () => {
        beforeEach(async () => {
          activeTableStore.setActiveTable(null)
          vi.clearAllMocks()
          joinMyTableMutationMock.mockResolvedValue({
            data: null,
          })
          await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyTableMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeTableStore.activeTable).toBeNull()
        })

        it('toasts no table found error', async () => {
          await flushPromises()
          expect(errorHandlerSpy).toHaveBeenCalledWith('No table found')
        })
      })

      describe('apollo with error', () => {
        beforeEach(async () => {
          activeTableStore.setActiveTable(null)
          vi.clearAllMocks()
          joinMyTableMutationMock.mockRejectedValue({
            message: 'OUCH',
          })
          await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
        })

        it('calls the api', () => {
          // eslint-disable-next-line vitest/prefer-called-with
          expect(joinMyTableMutationMock).toHaveBeenCalled()
        })

        it('does not update the store', () => {
          expect(activeTableStore.activeTable).toBeNull()
        })

        it('toasts no table found error', () => {
          expect(errorHandlerSpy).toHaveBeenCalledWith(
            'Error opening table',
            new ApolloError({ errorMessage: 'OUCH' }),
          )
        })
      })
    })
  })

  describe('desktop', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })

    it('button list content is hidden', () => {
      expect(wrapper.find('.button-list-desktop .new-project-button').exists()).toBe(false)
      expect(wrapper.find('.button-list-desktop .new-table-button').exists()).toBe(false)
      expect(wrapper.find('.button-list-desktop .assistent-button').exists()).toBe(false)
    })

    describe('click on create button', () => {
      it('button list visible', async () => {
        await wrapper.find('#dream-mall-button').trigger('click')
        expect(wrapper.find('.button-list-desktop .new-project-button').exists()).toBe(true)
        expect(wrapper.find('.button-list-desktop .new-table-button').exists()).toBe(true)
        expect(wrapper.find('.button-list-desktop .assistant-button').exists()).toBe(true)
      })
    })

    describe('new table button', () => {
      beforeEach(() => {
        wrapper = Wrapper()
      })

      describe('enter table', () => {
        describe('apollo with success', () => {
          beforeEach(async () => {
            vi.clearAllMocks()
            joinMyTableMutationMock.mockResolvedValue({
              data: {
                joinMyTable: 'http://link-to-my.table',
              },
            })
            await wrapper.find('#dream-mall-button').trigger('click')
            await wrapper.find('.button-list-desktop button.new-table-button').trigger('click')
          })

          it('calls the api', () => {
            // eslint-disable-next-line vitest/prefer-called-with
            expect(joinMyTableMutationMock).toHaveBeenCalled()
          })

          it('updates the store', () => {
            expect(activeTableStore.activeTable).toBe('http://link-to-my.table')
          })

          it('navigates to table page', async () => {
            await flushPromises()
            expect(navigate).toHaveBeenCalledWith('/table/')
          })
        })

        describe('apollo with no data', () => {
          beforeEach(async () => {
            activeTableStore.setActiveTable(null)
            vi.clearAllMocks()
            joinMyTableMutationMock.mockResolvedValue({
              data: null,
            })
            await wrapper.find('#dream-mall-button').trigger('click')
            await wrapper.find('.button-list-desktop button.new-table-button').trigger('click')
          })

          it('calls the api', () => {
            // eslint-disable-next-line vitest/prefer-called-with
            expect(joinMyTableMutationMock).toHaveBeenCalled()
          })

          it('does not update the store', () => {
            expect(activeTableStore.activeTable).toBeNull()
          })

          // it('toasts no table found error', () => {
          //   expect(errorHandlerSpy).toHaveBeenCalledWith('No table found')
          // })
        })

        describe('apollo with error', () => {
          beforeEach(async () => {
            activeTableStore.setActiveTable(null)
            vi.clearAllMocks()
            joinMyTableMutationMock.mockRejectedValue({
              message: 'OUCH',
            })
            await wrapper.find('#dream-mall-button').trigger('click')
            await wrapper.find('.button-list-desktop button.new-table-button').trigger('click')
          })

          it('calls the api', () => {
            expect(joinMyTableMutationMock).toHaveBeenCalledWith({})
          })

          it('does not update the store', () => {
            expect(activeTableStore.activeTable).toBeNull()
          })

          it('toasts no table found error', () => {
            expect(errorHandlerSpy).toHaveBeenCalledWith(
              'Error opening table',
              new ApolloError({ errorMessage: 'OUCH' }),
            )
          })
        })
      })
    })
  })

  describe('BottomMenu', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })

    it('renders BottomMenu', () => {
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
          expect(authServiceSpy).toHaveBeenCalledWith()
        })

        it('clears the store', () => {
          expect(storeSpy).toHaveBeenCalledWith()
        })
      })

      describe('with error', () => {
        beforeEach(async () => {
          authServiceSpy.mockRejectedValue('Error!')
          await wrapper.find('button.user-info').trigger('click')
          await flushPromises()
          await wrapper.findComponent(UserDropdown).find('button.sign-out').trigger('click')
        })

        it('logs the error', () => {
          expect(errorHandlerSpy).toHaveBeenCalledWith('auth error', 'Error!')
        })
      })
    })
  })

  describe('TopMenu', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })

    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
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

          it('redirects to admin url by click', async () => {
            await wrapper.findComponent(UserDropdown).find('button.admin-button').trigger('click')
            expect(global.window.location.href).toBe('https://url-to-admin.com/')
          })
        })
      })
    })
  })
})
