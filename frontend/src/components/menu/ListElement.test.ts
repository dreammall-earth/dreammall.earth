import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import { VIcon, VBtn } from 'vuetify/components'

import ListElement from './ListElement.vue'

interface Item {
  title: string
  subtitle?: string
  fullWidth: boolean
  rounded?: boolean
  prepend?: string | object
  prependProps?: object
  append?: string | object
  appendProps?: object
}

describe('ListElement', () => {
  let wrapper: VueWrapper<InstanceType<typeof ListElement>>
  const vuetify = createVuetify()

  beforeEach(() => {
    wrapper = mount(ListElement, {
      global: {
        plugins: [vuetify],
      },
      props: {
        items: [
          { title: 'Item 1', fullWidth: false, append: VBtn, appendProps: { icon: 'mdi-menu' } },
          { title: 'Item 2', fullWidth: true, append: VIcon, appendProps: { icon: 'mdi-menu' } },
        ] as Item[],
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders list items', () => {
    expect(wrapper.findAll('.custom-list-item').length).toBe(2)
  })

  it('renders append slot correctly', () => {
    const items = wrapper.findAll('.custom-list-item')
    const appendIcons = items.flatMap(item => item.findAllComponents(VIcon))
    const appendButtons = items.flatMap(item => item.findAllComponents(VBtn))
    expect(appendIcons).toBe(1)
    expect(appendButtons).toBe(1)
  })

  it('handles item click and closes menu', async () => {
    const emitSpy = vi.spyOn(wrapper.vm, '$emit')
    const items = wrapper.findAll('.custom-list-item')
    await items[0].trigger('click')
    expect(emitSpy).toHaveBeenCalledWith('item-click', expect.any(Object))
  })
})
