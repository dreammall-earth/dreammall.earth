import { ApolloError } from '@apollo/client/errors'
import { provideApolloClient } from '@vue/apollo-composable'
import { flushPromises, mount } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinTableAsGuestQuery } from '#queries/joinTableAsGuestQuery'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import JoinTablePage from './+Page.vue'
import Route from './+route'
import { title } from './+title'

const joinTableAsGuestQueryMock = vi.fn()

const mockClient = createMockClient()

mockClient.setRequestHandler(
  joinTableAsGuestQuery,
  joinTableAsGuestQueryMock.mockResolvedValue({ data: { joinTable: 'http://some.url' } }),
)

provideApolloClient(mockClient)

describe('JoinTablePage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(JoinTablePage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('returns join Table title', () => {
    expect(title()).toBe('Raum beitreten')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('has tableID as param', () => {
    expect(Route).toBe('/join-table/@id')
  })

  describe('Api', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      await wrapper.find('input').setValue('PinkyPie')
      await wrapper.find('form').trigger('submit')
    })

    it('calls JoinTable query', () => {
      // eslint-disable-next-line vitest/prefer-called-with
      expect(joinTableAsGuestQueryMock).toHaveBeenCalled()
    })

    describe('Table Link returned', () => {
      beforeEach(async () => {
        joinTableAsGuestQueryMock.mockResolvedValue({
          data: { joinTableAsGuest: 'http://meinlink.de' },
        })
        vi.clearAllMocks()
        await wrapper.find('form').trigger('submit')
      })

      it('Redirects to table Link', () => {
        expect(global.window.location.href).toBe('http://meinlink.de/')
      })
    })

    describe('Error returned', () => {
      beforeEach(async () => {
        joinTableAsGuestQueryMock.mockRejectedValue({ message: 'autsch' })
        await flushPromises()
        vi.clearAllMocks()
        await wrapper.find('form').trigger('submit')
      })

      it('logs Table not found', () => {
        expect(errorHandlerSpy).toHaveBeenCalledWith(
          'table link not found',
          new ApolloError({ errorMessage: 'autsch' }),
        )
      })
    })
  })
})
