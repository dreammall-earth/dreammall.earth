import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import IndexPage from './+Page.vue'

describe('IndexPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(IndexPage as Component),
    },
  })

  it('renders IndexPage with sections', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
