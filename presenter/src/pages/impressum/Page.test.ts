import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import ImpressumPage from './+Page.vue'
import { title } from './+title'

describe('ImpressumPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(ImpressumPage as Component),
    },
  })

  it('title returns correct title', () => {
    expect(title).toBe('DreamMall | Impressum')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
