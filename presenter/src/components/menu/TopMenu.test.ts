import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import AnchorLink from '#components/nav/AnchorLink.vue'

import LogoImage from './LogoImage.vue'
import TopMenu from './TopMenu.vue'

describe('FooterMenu', () => {
  const wrapper = mount(TopMenu)

  it('renders three columns', () => {
    expect(wrapper.find('.v-row').exists()).toBeTruthy()
    expect(wrapper.findAll('.v-row > div')).toHaveLength(3)
  })

  it('first column contains logo', () => {
    expect(wrapper.findAll('.v-row > div')[0].findComponent(LogoImage)).toBeTruthy()
  })

  it('second column contains 3 children -> AnchorLink', () => {
    expect(wrapper.findAll('.v-row > div')[1].findAllComponents(AnchorLink)).toHaveLength(3)
  })

  it('third column is placeholdre', () => {
    expect(wrapper.findAll('.v-row > div')[2].findAll('div')).toHaveLength(0)
  })
})
