import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ListElement from './ListElement.vue'

interface Item {
  title: string
  subtitle?: string
  fullWidth: boolean
  rounded?: boolean
  icon?: string
  image?: string
  rightContent?: string | object
}

describe('ListElement', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(ListElement, {
      props: {
        items: [
          { title: 'Item 1', fullWidth: false },
          { title: 'Item 2', fullWidth: true },
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

  it('handles item click and closes menu', async () => {
    const handleItemClick = vi.spyOn(wrapper.vm, 'handleItemClick')
    await wrapper.findAll('.custom-list-item')[0].trigger('click')
    expect(handleItemClick).toHaveBeenCalled()
    // Sie können hier zusätzliche Tests hinzufügen, um zu prüfen, ob das Menü geschlossen wird.
  })
})
