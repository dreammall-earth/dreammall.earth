import { mount, config } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Section4 from './Section4.vue'

describe('Section4', () => {
  const wrapper = mount(Section4)

  it('renders section4', () => {
    expect(wrapper.find('.section4').exists()).toBeTruthy()    
  })
})
