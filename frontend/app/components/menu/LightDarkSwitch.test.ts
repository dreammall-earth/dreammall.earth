import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import LightDarkSwitch from './LightDarkSwitch.vue'

describe('LightDarkSwitch', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(LightDarkSwitch as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('has light theme as default', () => {
    expect(wrapper.vm.theme.global.name.value).toBe('light')
  })

  // theme seems to be global and does not reset
  describe('click button', () => {
    beforeEach(async () => {
      await wrapper.find('button').trigger('click')
    })

    it('changes to dark theme', () => {
      expect(wrapper.vm.theme.global.name.value).toBe('dark')
    })

    describe('click buttom again', () => {
      it('changes to light theme', () => {
        expect(wrapper.vm.theme.global.name.value).toBe('light')
      })
    })
  })
})
