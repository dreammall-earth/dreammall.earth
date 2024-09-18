import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import OptionButton from './OptionButton.vue'

describe('Option Button', () => {
  const Wrapper = () => mount(OptionButton)

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits click event when clicked', async () => {
    const wrapper = Wrapper()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
