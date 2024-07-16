import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'

import MessageIndicator from './MessageIndicator.vue'

describe('MessageIndicator', () => {
  const Wrapper = (options = { props: { numberOfMessages: 1 } }) => {
    return mount(MessageIndicator, options)
  }

  let wrapper: ReturnType<typeof Wrapper>

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders with 1 message', () => {
    wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders with 2 messages', () => {
    wrapper = Wrapper({ props: { numberOfMessages: 2 } })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders with 0 messages', () => {
    wrapper = Wrapper({ props: { numberOfMessages: 2 } })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('displays the number of messages', async () => {
    wrapper = Wrapper()
    expect(wrapper.text()).toContain('1')
    await wrapper.setProps({ numberOfMessages: 5 })
    expect(wrapper.text()).toContain('5')
  })
})
