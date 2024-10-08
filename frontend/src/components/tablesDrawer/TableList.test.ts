import { flushPromises, mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { navigate } from 'vike/client/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import TableList from './TableList.vue'

vi.mock('vike/client/router')

const testTables = [
  {
    id: 69,
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
    isModerator: true,
    type: 'MALL_TALK' as const,
  },
  {
    id: 77,
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
    isModerator: false,
    type: 'MALL_TALK' as const,
  },
]

describe('TableList', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TableList, {
          list: {
            type: 'mallTalk' as const,
            heading: 'mall talk',
            items: testTables,
          },
          searchValue: '',
        }),
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
      expect(navigate).toHaveBeenCalledWith('/table/69')
    })
  })
})
