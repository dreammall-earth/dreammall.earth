import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import DataPrivacyCheckbox from './DataPrivacyCheckbox.vue'

describe('DataPrivacyCheckbox', () => {
  const Wrapper = () => {
    return mount(DataPrivacyCheckbox)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits the modelValue:update event on checkbox change', async () => {
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('modelValue:update')).toMatchObject([[1]])
  })
})
