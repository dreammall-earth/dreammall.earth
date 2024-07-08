import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import ListElement from './ListElement.vue'

describe('ListElement', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(ListElement),
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

  it('renders list', () => {
    expect(wrapper.find('.v-list--density-default').exists()).toBeTruthy()
  })
})
