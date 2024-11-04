import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import UserDropdown from './UserDropdown.vue'

describe('UserDropdown', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(UserDropdown as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('click dark button', () => {
    beforeEach(async () => {
      await wrapper.find('button[data-test-theme-switch').trigger('click')
    })

    it('changes to dark theme', () => {
      expect(wrapper.vm.theme.global.name.value).toBe('dark')
    })

    describe('click botton again', () => {
      it('changes to light theme', () => {
        expect(wrapper.vm.theme.global.name.value).toBe('light')
      })
    })
  })
})
