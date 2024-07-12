import { ApolloError } from '@apollo/client/errors'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinRoomQuery } from '#queries/joinRoomQuery'
import { mockClient } from '#tests/mock.apolloClient'
import { errorHandlerSpy } from '#tests/plugin.globalErrorHandler'

import JoinRoomPage from './+Page.vue'
import Route from './+route'
import { title } from './+title'

const joinRoomQueryMock = vi.fn()

mockClient.setRequestHandler(
  joinRoomQuery,
  joinRoomQueryMock.mockResolvedValue({ data: { joinRoom: 'http://some.url' } }),
)

describe('JoinRoomPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(JoinRoomPage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('returns join Room title', () => {
    expect(title()).toBe('Raum beitreten')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('has roomID as param', () => {
    expect(Route).toBe('/join-room/@id')
  })

  describe('Api', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      await wrapper.find('input').setValue('PinkyPie')
      await wrapper.find('form').trigger('submit')
    })

    it('calls JoinRoom query', () => {
      expect(joinRoomQueryMock).toBeCalled()
    })

    describe('Room Link returned', () => {
      beforeEach(async () => {
        joinRoomQueryMock.mockResolvedValue({ data: { joinRoom: 'http://meinlink.de' } })
        vi.clearAllMocks()
        await wrapper.find('form').trigger('submit')
      })

      it('Redirects to room Link', () => {
        expect(global.window.location.href).toBe('http://meinlink.de')
      })
    })

    describe('Error returned', () => {
      beforeEach(async () => {
        joinRoomQueryMock.mockRejectedValue({ message: 'autsch' })
        await flushPromises()
        vi.clearAllMocks()
        await wrapper.find('form').trigger('submit')
      })

      it('logs Room not found', () => {
        expect(errorHandlerSpy).toBeCalledWith(
          'room link not found',
          new ApolloError({ errorMessage: 'autsch' }),
        )
      })
    })
  })
})
