import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TableItem from './TableItem.vue'

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
})
