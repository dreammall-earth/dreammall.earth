import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import HeaderMenu from './HeaderMenu.vue'

describe('HeaderMenu', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(HeaderMenu as Component),
    },
  })

  it('renders three columns', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
