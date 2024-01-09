import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import SectionColumnCard from './SectionColumnCard.vue'

describe('SectionColumnCard', () => {
  const wrapper = mount(SectionColumnCard)

  it('renders SectionColumnCard with all elements', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
