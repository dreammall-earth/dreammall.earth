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
})
