import { mount, config } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Section2 from './Section2.vue'

describe('Section2', () => {
  const wrapper = mount(Section2)

  it('renders section2', () => {
    expect(wrapper.find('.section2').exists()).toBeTruthy()    
  })
})
