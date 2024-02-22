import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import DataPrivacyPage from './+Page.vue'
import { title } from './+title'

describe('DataPrivacyPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(DataPrivacyPage as Component),
    },
  })

  it('title returns correct title', () => {
    expect(title).toBe('DreamMall | Datenschutz')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
