import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ListElement from './ListElement.vue'

describe('ListElement', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(ListElement, {
      props: {
        items: [
          { title: 'Item 1', fullWidth: false },
          { title: 'Item 2', fullWidth: true },
        ],
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders list items', () => {
    expect(wrapper.findAll('.custom-list-item').length).toBe(2)
  })
})
