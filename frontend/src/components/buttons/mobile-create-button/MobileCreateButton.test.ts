import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import MobileCreateButton from './MobileCreateButton.vue'

describe('MobileCreateButton', () => {
  const Wrapper = (props = { isActive: false }) => {
    return mount(VApp, {
      slots: {
        default: h(MobileCreateButton, props),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders inactive', () => {
    wrapper = Wrapper()
    expect(wrapper.findComponent(MobileCreateButton).element).toMatchSnapshot()
  })

  it('renders active', () => {
    wrapper = Wrapper({ isActive: true })
    expect(wrapper.findComponent(MobileCreateButton).element).toMatchSnapshot()
  })

  describe('click on create button', () => {
    it('emits click event', async () => {
      wrapper = Wrapper()
      await wrapper.find('#create-button-mobile').trigger('click')
      const component = wrapper.findComponent(MobileCreateButton)
      expect(component.emitted('button-click')).toBeTruthy()
    })
  })
})
