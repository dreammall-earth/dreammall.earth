import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import NameInput from './NameInput.vue'

describe('MainButton', () => {
  const Wrapper = () => {
    return mount(NameInput, { props: { modelValue: '' } })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits the update:modelValue event on input', async () => {
    await wrapper.find('input').setValue('New Name')
    expect(wrapper.emitted('update:modelValue')).toEqual([['New Name']])
  })
})
