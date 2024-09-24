import { ApolloError } from '@apollo/client/errors'
import { provideApolloClient } from '@vue/apollo-composable'
import { flushPromises, mount } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { getTableNameQuery } from '#queries/getTableName'
import { joinTableAsGuestQuery } from '#queries/joinTableAsGuestQuery'
import { createMockPlugin } from '#tests/plugin.globalErrorHandler'

import JoinTablePage from './+Page.vue'
import Route from './+route'
import { title } from './+title'

const joinTableAsGuestQueryMock = vi.fn()
const getTableNameQueryMock = vi.fn()

const mockClient = createMockClient()
const { mockPlugin, errorSpy } = createMockPlugin()

mockClient.setRequestHandler(joinTableAsGuestQuery, joinTableAsGuestQueryMock)
mockClient.setRequestHandler(getTableNameQuery, getTableNameQueryMock)

provideApolloClient(mockClient)

describe('JoinTablePage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      global: { plugins: [mockPlugin] },
      slots: {
        default: h(JoinTablePage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    vi.clearAllMocks()
    getTableNameQueryMock.mockResolvedValue({ data: { getTableName: 'Test Table' } })
    joinTableAsGuestQueryMock.mockResolvedValue({ data: { joinTableAsGuest: 'http://some.url' } })
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

  describe('Table name fetching', () => {
    it('displays the fetched table name', async () => {
      await flushPromises()
      expect(wrapper.find('.section-headline').text()).toBe('Test Table')
    })

    it('displays public table when no name is fetched', async () => {
      getTableNameQueryMock.mockResolvedValueOnce({ data: { getTableName: null } })
      wrapper = Wrapper()
      await flushPromises()
      expect(wrapper.find('.section-headline').text()).not.toBe('')
    })

    it('displays no controls when there is an error fetching the table name', async () => {
      getTableNameQueryMock.mockRejectedValueOnce(new Error('Failed to fetch table name'))
      wrapper = Wrapper()
      await flushPromises()
      expect(wrapper.find('.reminder p').exists()).toBeTruthy()
      expect(wrapper.find('input').exists()).toBeFalsy()
      expect(wrapper.find('button').exists()).toBeFalsy()
    })
  })

  describe('Join Table API', () => {
    beforeEach(async () => {
      await wrapper.find('input').setValue('PinkyPie')
      await wrapper.find('button').trigger('click')
      await flushPromises()
    })

    it('calls JoinTable query', () => {
      // eslint-disable-next-line vitest/prefer-called-with
      expect(joinTableAsGuestQueryMock).toHaveBeenCalled()
    })

    describe('Table Link returned', () => {
      beforeEach(async () => {
        await flushPromises()
        joinTableAsGuestQueryMock.mockResolvedValueOnce({
          data: { joinTableAsGuest: 'http://meinlink.de' },
        })
        await wrapper.find('button').trigger('click')
      })

      it('Redirects to table Link', () => {
        expect(global.window.location.href.replace(/\/$/, '')).toBe('http://meinlink.de')
      })
    })

    describe('Error returned', () => {
      beforeEach(async () => {
        joinTableAsGuestQueryMock.mockRejectedValue({ message: 'autsch' })
        await flushPromises()
        vi.clearAllMocks()
        await wrapper.find('button').trigger('click')
      })

      it('logs Table not found', () => {
        expect(errorSpy).toHaveBeenCalledWith(
          new Error('table link not found', { cause: new ApolloError({ errorMessage: 'autsch' }) }),
        )
      })
    })
  })
})
