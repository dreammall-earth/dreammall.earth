import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import ImpressumPage from './+Page.vue'

describe('ImpressumPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(ImpressumPage as Component),
    },
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
