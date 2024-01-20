import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import SixthSection from './SixthSection.vue'

describe('renders SixthSection', () => {
  const wrapper = mount(SixthSection)

  it('renders SixthSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
