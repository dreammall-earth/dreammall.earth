import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import CircleElement from './CircleElement.vue'

describe('CircleElement', () => {
  const Wrapper = () => {
    return mount(CircleElement)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
