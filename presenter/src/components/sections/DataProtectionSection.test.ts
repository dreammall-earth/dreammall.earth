import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import DataProtectionSection from './DataProtectionSection.vue'

describe('DataProtectionSection', () => {
  const Wrapper = () => {
    return mount(DataProtectionSection)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders 4 cards', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
