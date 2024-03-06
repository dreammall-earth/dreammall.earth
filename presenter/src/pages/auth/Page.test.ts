import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import AuthPage from './+Page.vue'
import { title } from './+title'

describe('AuthPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(AuthPage as Component),
    },
  })

  it('title returns correct title', () => {
    expect(title).toBe('DreamMall | Authentifizierung')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
