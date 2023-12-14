import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import ImpressSection from '#components/sections/ImpressSection.vue'

import ImpressumPage from './impressum.page.vue'

describe('ImpressumPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      default: h(ImpressumPage),
    },
  })

  it('renders', () => {
    expect(wrapper.find('#impress').findComponent(ImpressSection)).toBeTruthy()
  })
})
