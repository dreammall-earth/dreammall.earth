import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import MainButton from '#components/inputs/MainButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'

import FirstSection from './FirstSection.vue'

describe('FirstSection', () => {
  const wrapper = mount(FirstSection)

  it('renders FirstSection', () => {
    expect(wrapper.find('.section1').exists()).toBeTruthy()

    expect(wrapper.find('.section1 .section-headline').exists()).toBeTruthy()
    expect(wrapper.find('.section1 .section-headline').text()).toBe(`$t('home.section1.headline')`)

    expect(wrapper.find('.section1').findComponent(LogoImage)).toBeTruthy()

    expect(wrapper.find('.section1 .section-subheadline').exists()).toBeTruthy()
    expect(wrapper.find('.section1 .section-subheadline').text()).toBe(
      `$t('home.section1.subHeadline')`,
    )

    expect(wrapper.find('.section1').findComponent(MainButton)).toBeTruthy()
    expect(wrapper.find('.section1').findComponent(MainButton).text()).toBe(
      "$t('home.section1.preOrderBtn')",
    )
  })
})
