import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import TextButtonInput from '#components/inputs/TextButtonInput.vue'
import AnchorLink from '#components/nav/AnchorLink.vue'

import FooterMenu from './FooterMenu.vue'
import LogoImage from './LogoImage.vue'

describe('FooterMenu', () => {
  const wrapper = mount(FooterMenu)

  it('renders four columns', () => {
    expect(wrapper.find('.v-row').exists()).toBeTruthy()
    expect(wrapper.findAll('.v-row > div')).toHaveLength(4)
  })

  it('first column contains logo', () => {
    expect(wrapper.findAll('.v-row > div')[0].findComponent(LogoImage)).toBeTruthy()
  })

  it('second column contains 4 children -> AnchorLink', () => {
    expect(wrapper.findAll('.v-row > div')[1].findAllComponents(AnchorLink)).toHaveLength(4)
  })

  it('third column contains 4 children -> AnchorLink', () => {
    expect(wrapper.findAll('.v-row > div')[2].findAllComponents(AnchorLink)).toHaveLength(4)
  })

  it('last column contains newsletterinput', () => {
    expect(wrapper.findAll('.v-row > div')[3].findComponent(TextButtonInput)).toBeTruthy()
  })
})
