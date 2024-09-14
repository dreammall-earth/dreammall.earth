import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import CoffeeSection from './CoffeeSection.vue'

describe('renders CoffeeSection', () => {
  const wrapper = mount(CoffeeSection)

  it('renders CoffeeSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
