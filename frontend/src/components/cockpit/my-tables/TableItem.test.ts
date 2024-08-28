import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, expect, it, vi } from 'vitest'

import TableItem from './TableItem.vue'

vi.mock('vike/client/router')

describe('Table Item', () => {
  const Wrapper = (
    props = {
      id: 1,
      name: 'Table Name',
      memberCount: 4,
    },
  ) =>
    mount(TableItem, {
      props,
    })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('camera icon', () => {
    it('navigates to table page when clicked', async () => {
      const wrapper = Wrapper()
      await wrapper.find('.camera-icon').trigger('click')
      expect(navigate).toHaveBeenCalledWith('/table/1')
    })
  })

  describe('options button', () => {
    it('opens options when clicked', async () => {
      const wrapper = Wrapper()
      await wrapper.find('button.options').trigger('click')
    })
  })
})
