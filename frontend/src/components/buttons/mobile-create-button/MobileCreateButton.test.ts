import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import MobileCreateButton from './MobileCreateButton.vue'

describe('MobileCreateButton', () => {
  const Wrapper = () => {
    return mount(MobileCreateButton, {})
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.findComponent(MobileCreateButton).element).toMatchSnapshot()
  })

  describe('click on create button', () => {
    it('emits click event', async () => {
      await wrapper.find('#create-button-mobile').trigger('click')
      expect(wrapper.emitted('button-click')).toBeTruthy()
    })
  })

  it('renders active', async () => {
    await wrapper.setProps({ isActive: true })
    expect(wrapper.element).toMatchSnapshot()
  })
})
