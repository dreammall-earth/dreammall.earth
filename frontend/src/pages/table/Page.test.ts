import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { useActiveTableStore } from '#stores/activeTableStore'

import TablePage from './+Page.vue'
import { title } from './+title'

const activeTableStore = useActiveTableStore()

describe('Table Page', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TablePage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('title returns default title', () => {
    expect(title()).toBe('DreamMall')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('active table store updates', () => {
    beforeEach(() => {
      activeTableStore.setActiveTable('https://my-table.link')
    })

    it('shows iframe with correct url', async () => {
      await flushPromises()
      expect(wrapper.find('iframe').exists()).toBe(true)
      expect(wrapper.find('iframe').attributes('src')).toBe('https://my-table.link')
    })
  })
})
