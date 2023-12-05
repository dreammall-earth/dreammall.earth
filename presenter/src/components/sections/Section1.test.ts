import { mount, config } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import Section1 from './Section1.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import MainButton from '#components/inputs/MainButton.vue'

describe('Section1', () => {
  const wrapper = mount(Section1)

  it('renders section1', () => {
    expect(wrapper.find('.section1').exists()).toBeTruthy()
    
    expect(wrapper.find('.section1 .headline').exists()).toBeTruthy()
    expect(wrapper.find('.section1 .headline').text()).toBe("$t('home.section1.headline')")
    
    expect(wrapper.find('.section1').findComponent(LogoImage)).toBeTruthy()
    
    expect(wrapper.find('.section1 .subheadline').exists()).toBeTruthy()
    expect(wrapper.find('.section1 .subheadline').text()).toBe("$t('home.section1.subHeadline')")

    expect(wrapper.find('.section1').findComponent(MainButton)).toBeTruthy()
    expect(wrapper.find('.section1').findComponent(MainButton).text()).toBe("$t('home.section1.preOrderBtn')")
    
  })
})
