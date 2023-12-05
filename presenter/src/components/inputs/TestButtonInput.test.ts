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
    expect(wrapper.find('.v-field__field > .v-field__input').exists()).toBeTruthy()
    expect(wrapper.find('.v-field').findComponent(MainButton)).toBeTruthy()
  })

  it('TextButtonInput emit click event', () => {
    wrapper.findComponent(MainButton).trigger('click')

    expect(wrapper.findComponent(MainButton).emitted()).toHaveProperty('click')
  })
})
