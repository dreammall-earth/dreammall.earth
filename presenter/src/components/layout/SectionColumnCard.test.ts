import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import SectionColumnCard from './SectionColumnCard.vue'

describe('SectionColumnCard', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(SectionColumnCard as Component),
    },
  })

  it('renders SectionColumnCard with all elements', () => {
    expect(wrapper.find('.v-card .v-img').exists()).toBeTruthy()
    expect(wrapper.find('.v-card .v-card-title').exists()).toBeTruthy()
    expect(wrapper.find('.v-card .v-card-text').exists()).toBeTruthy()
  })
})
