import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { VApp } from 'vuetify/components'

import StarMap from './StarMap.vue'

describe('StarMap', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: StarMap,
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  // Weitere Tests können hier hinzugefügt werden
})
