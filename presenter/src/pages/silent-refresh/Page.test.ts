import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import SilentRefreshPage from './+Page.vue'
import { title } from './+title'

describe('SilentRefreshPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(SilentRefreshPage as Component),
    },
  })

  it('title returns correct title', () => {
    expect(title).toBe('DreamMall | Authentifizierung')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
