import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { joinRoomQuery } from '#queries/joinRoomQuery'
import { mockClient } from '#tests/mock.apolloClient'

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
    joinRoomQueryMock.mockResolvedValue({ data: { getRoom: 'http://some.url' } })
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
})
