import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import SecondSection from './SecondSection.vue'

describe('SecondSection', () => {
  const wrapper = mount(SecondSection)

  it('renders SecondSection', () => {
    expect(wrapper.find('.section2').exists()).toBeTruthy()
  })
})
