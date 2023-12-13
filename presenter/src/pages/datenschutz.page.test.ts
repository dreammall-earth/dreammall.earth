import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import DataProtectionSection from '#components/sections/DataProtectionSection.vue'

import DataPrivacyPage from './datenschutz.page.vue'

describe('DataPrivacyPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      default: h(DataPrivacyPage),
    },
  })

  it('renders', () => {
    expect(wrapper.find('#data-protection').findComponent(DataProtectionSection)).toBeTruthy()
  })
})
