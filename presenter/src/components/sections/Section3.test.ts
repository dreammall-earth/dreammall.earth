import { mount, config } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Section3 from './Section3.vue'

describe('Section3', () => {
  const wrapper = mount(Section3)

  it('renders section3', () => {
    expect(wrapper.find('.section3').exists()).toBeTruthy()    
  })
})
