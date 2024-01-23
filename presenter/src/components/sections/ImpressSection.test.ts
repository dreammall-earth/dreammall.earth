import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import ImpressSection from './ImpressSection.vue'

describe('ImpressSection', () => {
  const Wrapper = () => {
    return mount(ImpressSection)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders 6 cards', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
