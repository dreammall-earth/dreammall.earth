import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import ThirdSection from './ThirdSection.vue'

describe('ThirdSection', () => {
  const wrapper = mount(ThirdSection)

  it('renders ThirdSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
