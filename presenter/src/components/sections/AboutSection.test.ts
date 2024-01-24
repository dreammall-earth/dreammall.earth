import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import AboutSection from './AboutSection.vue'

describe('AboutSection', () => {
  const wrapper = mount(AboutSection)

  it('renders AboutSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
