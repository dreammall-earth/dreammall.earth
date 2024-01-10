import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import FifthSection from './FifthSection.vue'

describe('renders FifthSection', () => {
  const wrapper = mount(FifthSection)

  it('renders FifthSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
