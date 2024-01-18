import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import IndexPage from './+Page.vue'
import route from './+route'

describe('OptinPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(IndexPage as Component),
    },
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('route returns `/optin/@code', () => {
    // while a bit senseless we cannot ignore +route.ts since it can contain complex logic
    expect(route).toBe('/optin/@code')
  })
})
