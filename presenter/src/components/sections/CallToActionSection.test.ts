import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import CallToActionSection from './CallToActionSection.vue'

describe('renders CallToActionSection', () => {
  const wrapper = mount(CallToActionSection)

  it('renders CallToActionSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
