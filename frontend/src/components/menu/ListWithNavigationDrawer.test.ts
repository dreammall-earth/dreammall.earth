import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'

describe('ListWithNavigationDrawer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ListWithNavigationDrawer, {
      props: { drawer: true },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('toggles drawer state', async () => {
    const drawer = wrapper.findComponent({ name: 'NavigationDrawer' })
    expect(drawer.props('modelValue')).toBe(true)
    wrapper.setProps({ drawer: false })
    await wrapper.vm.$nextTick()
    expect(drawer.props('modelValue')).toBe(false)
  })
})
