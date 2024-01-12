import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import MainButton from './MainButton.vue'
import TextButtonInput from './TextButtonInput.vue'

describe('TextButtonInput', () => {
  const wrapper = mount(TextButtonInput, {
    props: {
      inputLabel: 'Input',
      buttonLabel: 'Button',
    },
  })

  it('TextButtonInput renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('TextButtonInput emit click event', async () => {
    await wrapper.findComponent(MainButton).trigger('click')

    expect(wrapper.findComponent(MainButton).emitted()).toHaveProperty('click')
  })
})
