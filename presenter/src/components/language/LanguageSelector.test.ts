import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import LanguageSelector from './LanguageSelector.vue'

describe('LanguageSelector', () => {
  const Wrapper = () => {
    return mount(LanguageSelector, {
      props: {},
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
