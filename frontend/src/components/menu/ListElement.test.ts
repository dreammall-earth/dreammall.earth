import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import ListElement from './ListElement.vue'
import { VIcon, VBtn } from 'vuetify/components'

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
    const appendIcons = wrapper.findAllComponents(VIcon)
    const appendButtons = wrapper.findAllComponents(VBtn)
    expect(appendIcons.length + appendButtons.length).toBe(2)
  })

  it('handles item click and closes menu', async () => {
    const emitSpy = vi.spyOn(wrapper.vm, '$emit')
    await wrapper.findAll('.custom-list-item')[0].trigger('click')
    expect(emitSpy).toHaveBeenCalledWith('item-click')
    // Sie können hier zusätzliche Tests hinzufügen, um zu prüfen, ob das Menü geschlossen wird.
  })
})
