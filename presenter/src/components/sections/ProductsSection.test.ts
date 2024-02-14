import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import ProductsSection from './ProductsSection.vue'

describe('ProductsSection', () => {
  const wrapper = mount(ProductsSection)

  it('renders ProductsSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
