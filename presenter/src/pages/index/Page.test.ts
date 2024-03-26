import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import i18n from '#plugins/i18n'

import IndexPage from './+Page.vue'
import { title } from './+title'

describe('IndexPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(IndexPage as Component),
    },
  })

  it('title returns default title', () => {
    expect(title()).toBe(i18n.global.t('meta.defaultTitle'))
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
