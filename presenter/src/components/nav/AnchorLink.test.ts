import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import AnchorLink from './AnchorLink.vue'

describe('AnchorLink', () => {
  const wrapper = mount(AnchorLink, {
    props: {
      label: 'AnchorLink',
      href: 'someAnchorOrUrl',
    },
  })

  it('renders Node with href', () => {
    expect(wrapper.find('a.v-btn').exists()).toBeTruthy()
  })

  it('sets href accordingly', () => {
    expect(wrapper.find('a.v-btn').attributes('href')).toBe('someAnchorOrUrl')
  })

  it('sets label accordingly', () => {
    expect(wrapper.find('a.v-btn').text()).toBe('AnchorLink')
  })
})
