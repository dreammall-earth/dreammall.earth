import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import NavigationDrawer from './NavigationDrawer.vue'

describe('NavigationDrawer', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(NavigationDrawer),
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
})