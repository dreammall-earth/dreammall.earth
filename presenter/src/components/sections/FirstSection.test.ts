import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import MainButton from '#components/inputs/MainButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'

import FirstSection from './FirstSection.vue'

describe('FirstSection', () => {
  const wrapper = mount(FirstSection)

  it('renders FirstSection', () => {
    expect(wrapper.find('.section1').exists()).toBeTruthy()
  })
})
