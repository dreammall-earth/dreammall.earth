import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { setupIntersectionObserverMock } from '#root/scripts/tests/mock.IntersectionObserver'

import TopMenu from './TopMenu.vue'

setupIntersectionObserverMock()

describe('TopMenu', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(TopMenu as Component),
    },
  })

  it('renders three columns', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
