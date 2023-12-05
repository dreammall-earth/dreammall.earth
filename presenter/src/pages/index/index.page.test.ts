import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Section1 from '#components/sections/FirstSection.vue'
import Section4 from '#components/sections/FourthSection.vue'
import Section2 from '#components/sections/SecondSection.vue'
import Section3 from '#components/sections/ThirdSection.vue'

import IndexPage from './index.page.vue'

describe('IndexPage', () => {
  const wrapper = mount(IndexPage)

  it('renders IndexPage with sections', () => {
    expect(wrapper.find('#section1').findComponent(Section1)).toBeTruthy()
    expect(wrapper.find('#about').findComponent(Section2)).toBeTruthy()
    expect(wrapper.find('#products').findComponent(Section3)).toBeTruthy()
    expect(wrapper.find('#contact').findComponent(Section4)).toBeTruthy()
  })
})
