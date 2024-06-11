import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import NavigationDrawer from './NavigationDrawer.vue'

describe('NavigationDrawer', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(NavigationDrawer, {
      props: { modelValue: true },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits update:modelValue when drawer changes', async () => {
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
