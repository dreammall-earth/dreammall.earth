import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import NewsIndicator from './NewsIndicator.vue'

describe('NewsIndicator', () => {
  const Wrapper = () => {
    return mount(NewsIndicator, { props: { hasNews: true } })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
