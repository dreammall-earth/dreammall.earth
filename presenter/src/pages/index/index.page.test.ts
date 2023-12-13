import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import Section5 from '#components/sections/FifthSection.vue'
import Section1 from '#components/sections/FirstSection.vue'
import Section4 from '#components/sections/FourthSection.vue'
import Section2 from '#components/sections/SecondSection.vue'
import Section6 from '#components/sections/SixthSection.vue'
import Section3 from '#components/sections/ThirdSection.vue'

import IndexPage from './index.page.vue'

describe('IndexPage', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(IndexPage),
    },
  })

  it('renders IndexPage with sections', () => {
    expect(wrapper.find('#section1').findComponent(Section1)).toBeTruthy()
    expect(wrapper.find('#about').findComponent(Section2)).toBeTruthy()
    expect(wrapper.find('#products').findComponent(Section3)).toBeTruthy()
    expect(wrapper.find('#section4').findComponent(Section4)).toBeTruthy()
    expect(wrapper.find('#section5').findComponent(Section5)).toBeTruthy()
    expect(wrapper.find('#section6').findComponent(Section6)).toBeTruthy()
  })
})
