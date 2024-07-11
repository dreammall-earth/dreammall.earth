//import { wrap } from 'module'

import { flushPromises, mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { navigate } from 'vike/client/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import { useActiveRoomStore } from '#stores/activeRoomStore'

import TableList from './TableList.vue'

vi.mock('vike/client/router')

const testTables = [
  {
    meetingID: 'my-meeting',
    meetingName: 'my meeting',
    startTime: '1234',
    participantCount: 1,
    attendees: [
      {
        fullName: 'Peter Lustig',
      },
    ],
    joinLink: 'https://my.link',
  },
  {
    meetingID: 'my-meeting-2',
    meetingName: 'my meeting',
    startTime: '1234',
    participantCount: 2,
    attendees: [
      {
        fullName: 'Peter Lustig',
      },
      {
        fullName: 'Max Mustermann',
      },
    ],
    joinLink: 'https://my.link',
  },
]

describe('TableList', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TableList, { items: testTables }),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  setActivePinia(createPinia())

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders list', () => {
    expect(wrapper.find('.v-list--density-default').exists()).toBe(true)
  })

  it('sets active room', async () => {
    const setActiveRoomSpy = vi.spyOn(useActiveRoomStore(), 'setActiveRoom')
    await wrapper.find('.table').trigger('click')

    expect(setActiveRoomSpy).toHaveBeenCalledWith(testTables[0].joinLink)
  })

  describe('when a table is clicked', () => {
    beforeEach(async () => {
      wrapper = Wrapper()
      await wrapper.find('.table').trigger('click')
      await flushPromises()
    })

    it('emit event "openRoom"', () => {
      const tableList = wrapper.findComponent(TableList)
      expect(tableList.emitted('openRoom')).toBeTruthy()
    })

    it('navigates to opened Room', () => {
      expect(navigate).toHaveBeenCalledWith('/room/')
    })
  })
})
