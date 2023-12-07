import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import FirstSection from './FirstSection.vue'

describe('FirstSection', () => {
  const wrapper = mount(FirstSection)

  it('renders FirstSection', () => {
    expect(wrapper.find('.section1').exists()).toBeTruthy()
  })
})
