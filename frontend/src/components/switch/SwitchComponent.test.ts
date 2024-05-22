import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import Switch from './SwitchComponent.vue'

describe('Switch', () => {
  const Wrapper = () => {
    return mount(Switch)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders label', async () => {
    await wrapper.setProps({ label: 'label' })

    expect(wrapper.find('span').text()).toBe('label')
  })

  it('emits change event when clicked', async () => {
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('changes state when clicked', async () => {
    const hiddenElementBefore = wrapper.find('svg[style="display: none;"]')

    await wrapper.find('button').trigger('click')

    const hiddenElementAfter = wrapper.find('svg[style="display: none;"]')

    expect(hiddenElementBefore.html()).not.toBe(hiddenElementAfter.html())
  })
})
