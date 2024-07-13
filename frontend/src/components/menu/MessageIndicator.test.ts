import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import MessageIndicator from './MessageIndicator.vue'

describe('MessageIndicator', () => {
  const Wrapper = () => {
    return mount(MessageIndicator, { props: { numberOfMessages: 1 } })
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

  it('displays the number of messages', async () => {
    await wrapper.setProps({ numberOfMessages: 1 })
    expect(wrapper.text()).toContain('1')
    await wrapper.setProps({ numberOfMessages: 5 })
    expect(wrapper.text()).toContain('5')
  })
})
