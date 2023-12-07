import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import FourthSection from './FourthSection.vue'

describe('renders FourthSection', () => {
  const wrapper = mount(FourthSection)

  it('renders FourthSection', () => {
    expect(wrapper.find('.section4').exists()).toBeTruthy()
  })
})
