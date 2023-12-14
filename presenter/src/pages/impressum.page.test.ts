import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import ImpressSection from '#components/sections/ImpressSection.vue'

import ImpressumPage from './impressum.page.vue'

describe('ImpressumPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(ImpressumPage as Component),
    },
  })

  it('renders', () => {
    expect(wrapper.find('#impress').findComponent(ImpressSection)).toBeTruthy()
  })
})
