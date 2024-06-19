import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { VApp } from 'vuetify/components'
import { h } from 'vue'

import NavigationDrawer from './NavigationDrawer.vue'

describe('NavigationDrawer', () => {
  
  const Wrapper = (propsData = { modelValue: true, location: 'right' }) => {
    return mount(VApp, {
      slots: {
        default: () => h(NavigationDrawer),
      },
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('has the correct default location', () => {
    expect(wrapper.findComponent(NavigationDrawer).props().location).toBe('right')
  })
})
