import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'
import NavigationDrawer from './NavigationDrawer.vue'

// Mock für useDisplay
vi.mock('vuetify', () => ({
  useDisplay: () => ({
    mobile: { value: false },
  }),
}))

describe('NavigationDrawer', () => {
  interface NavigationDrawerProps {
    modelValue: boolean
    location: string
  }

  let wrapper: VueWrapper<any>

  const Wrapper = (props: NavigationDrawerProps) => {
    return mount(VApp, {
      slots: {
        default: () => h(NavigationDrawer),
      },
      props,
      attachTo: document.body,
    })
  }

  beforeEach(() => {
    wrapper = Wrapper({ modelValue: false, location: 'right' })
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

})
