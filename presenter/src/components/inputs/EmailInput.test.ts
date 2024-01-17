import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import EmailInput from './EmailInput.vue'

describe('EmailInput', () => {
  const Wrapper = () => {
    return mount(EmailInput)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits the update:modelValue event on input', async () => {
    await wrapper.find('input').setValue('new@email.com')
    expect(wrapper.emitted('update:modelValue')).toMatchObject([['new@email.com']])
  })
})
