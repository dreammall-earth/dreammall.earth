import { mount, config } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import LogoImage from './LogoImage.vue'

describe('LogoImage', () => {
  const wrapper = mount(LogoImage)

  it('renders Logo', () => {
    expect(wrapper.find('.v-img').exists()).toBeTruthy()
    expect(wrapper.find('.v-img__img').attributes().src).toBe("/src/assets/dreammall-logo.svg")
  })
})
