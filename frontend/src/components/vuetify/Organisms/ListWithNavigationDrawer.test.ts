import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'

describe('ListWithNavigationDrawer', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(ListWithNavigationDrawer as Component),
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
