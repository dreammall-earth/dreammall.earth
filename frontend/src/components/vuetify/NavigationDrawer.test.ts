import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import NavigationDrawer from './NavigationDrawer.vue'

describe('NavigationDrawer', () => {
  const Wrapper = (props = {}) => {
    return mount(VApp, {
      slots: {
        default: h(NavigationDrawer, { modelValue: false, ...props }), // initiale Props setzen
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

  it('is closed by default', () => {
    const drawer = wrapper.findComponent(NavigationDrawer)
    expect(drawer.props('modelValue')).toBe(false)
  })

  it('opens when modelValue prop is set to true', async () => {
    wrapper = Wrapper({ modelValue: true }) 
    const drawer = wrapper.findComponent(NavigationDrawer)
    expect(drawer.props('modelValue')).toBe(true) 
  })
})
