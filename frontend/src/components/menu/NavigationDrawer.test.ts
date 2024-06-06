import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import NavigationDrawer from './NavigationDrawer.vue'

describe('NavigationDrawer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(NavigationDrawer, {
      props: { modelValue: true },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits update:modelValue when drawer changes', async () => {
    wrapper.setProps({ modelValue: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
