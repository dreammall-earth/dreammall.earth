import { flushPromises, mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import EmbeddedRoom from '#components/embedded-room/EmbeddedRoom.vue'
import { useActiveRoomStore } from '#stores/activeRoomStore'

import RoomPage from './+Page.vue'
import { title } from './+title'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

const activeRoomStore = useActiveRoomStore()

describe('Room Page', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(RoomPage as Component),
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

  describe('active room store updates', () => {
    beforeEach(() => {
      activeRoomStore.setActiveRoom('https://my-room.link')
    })

    it('shows iframe with correct url', async () => {
      await flushPromises()
      expect(wrapper.find('iframe').exists()).toBe(true)
      expect(wrapper.find('iframe').attributes('src')).toBe('https://my-room.link')
    })
  })

  describe('embedded room emits close event', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      wrapper.getComponent(EmbeddedRoom).vm.$emit('closed')
    })

    it('navigates to /', () => {
      expect(navigate).toBeCalledWith('/')
    })
  })
})
