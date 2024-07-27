import { flushPromises, mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { navigate } from 'vike/client/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import { useActiveTableStore } from '#stores/activeTableStore'

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

  it('sets active table', async () => {
    const setActiveTableSpy = vi.spyOn(useActiveTableStore(), 'setActiveTable')
    await wrapper.find('.table .action').trigger('click')

    expect(setActiveTableSpy).toHaveBeenCalledWith(testTables[0].joinLink)
  })

  describe('when a table is clicked', () => {
    beforeEach(async () => {
      wrapper = Wrapper()
      await wrapper.find('.table .action').trigger('click')
      await flushPromises()
    })

    it('emit event "openTable"', () => {
      const tableList = wrapper.findComponent(TableList)
      expect(tableList.emitted('openTable')).toBeTruthy()
    })

    it('navigates to opened Table', () => {
      expect(navigate).toHaveBeenCalledWith('/table/')
    })
  })
})
