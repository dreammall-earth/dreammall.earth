import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { useActiveRoomStore } from '#stores/activeRoomStore'

import RoomPage from './+Page.vue'
import { title } from './+title'

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
      expect(wrapper.find('iframe').exists()).toBeTruthy()
      expect(wrapper.find('iframe').attributes('src')).toBe('https://my-room.link')
    })
  })
})
