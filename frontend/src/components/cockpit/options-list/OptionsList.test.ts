import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import OptionsList from './OptionsList.vue'

describe('OptionsList', () => {
  const Wrapper = (
    props = {
      isVisible: true,
    },
  ) => mount(OptionsList, { props })

  it('renders when visible', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders when not visible', () => {
    const wrapper = Wrapper({ isVisible: false })
    expect(wrapper.element).toMatchSnapshot()
  })
})
