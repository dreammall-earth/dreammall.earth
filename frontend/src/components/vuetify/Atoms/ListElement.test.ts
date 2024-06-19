import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import { VIcon, VAvatar, VImg } from 'vuetify/components'

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
          {
            title: 'LOLLY Krypto Entwicklung',
            subtitle: 'Krypto für Alle',
            prepend: VAvatar,
            prependProps: { color: 'primary', icon: 'mdi-lock' },
            append: VIcon,
            appendProps: { icon: 'mdi-dots-vertical', class: 'append-icon' },
          },
          {
            title: 'Aachener Freunde Treff',
            subtitle: 'Aachener Freunde Treff',
            prepend: VImg,
            prependProps: {
              src: 'https://picsum.photos/40',
              referrerpolicy: 'no-referrer',
              width: 40,
              height: 40,
            },
            append: VIcon,
            appendProps: { icon: 'mdi-dots-vertical', class: 'append-icon' },
          },
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
    const items = wrapper.findAll('.custom-list-item')
    await items[0].trigger('click')
    expect(wrapper.emitted('item-click')).toEqual([[]])
  })
})
