import { mount, config } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import MainButton from './MainButton.vue'

describe('MainButton', () => {
  const wrapper = mount(MainButton,{
    props:{
        label: "Button",
        variant: "primary",
        size: "large"
    }    
  })

  it('MainButton renders', () => {
    expect(wrapper.find('.v-btn').exists()).toBeTruthy()
  })

  it('MainButton emits click event', () => {
    wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('MainButton sets correct css size class', async () => {
    expect(wrapper.find('.v-btn').classes()).toContain('main-button--large')

    await wrapper.setProps({ size: 'small' })

    expect(wrapper.find('.v-btn').classes()).toContain('main-button--small')
  })
})
