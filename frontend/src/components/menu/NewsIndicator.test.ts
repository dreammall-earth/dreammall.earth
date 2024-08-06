import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'

import NewsIndicator from './NewsIndicator.vue'

describe('NewsIndicator', () => {
  const Wrapper = (options = { props: { hasNews: true } }) => {
    return mount(NewsIndicator, options)
  }

  let wrapper: ReturnType<typeof Wrapper>

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders with news', () => {
    wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders without news', () => {
    wrapper = Wrapper({ props: { hasNews: false } })
    expect(wrapper.element).toMatchSnapshot()
  })
})
