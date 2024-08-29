import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MyTables from './MyTables.vue'

describe('MyTables', () => {
  const Wrapper = (props = {}) =>
    mount(MyTables, {
      props,
    })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })
})
