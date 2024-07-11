import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import TablesDrawer from './TablesDrawer.vue'

describe('TablesDrawer', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TablesDrawer as Component, { drawer: true }),
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
