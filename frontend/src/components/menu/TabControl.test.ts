import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { usePageContext } from '#root/renderer/context/usePageContext'

import TabControl from './TabControl.vue'

vi.mock('#root/renderer/context/usePageContext')
const mockedUsePageContext = vi.mocked(usePageContext)

describe('TabControl', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TabControl as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    mockedUsePageContext.mockReturnValue({
      urlPathname: '/',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('set active item by route', () => {
    it('sets first item active for /', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      mockedUsePageContext.mockReturnValue({
        urlPathname: '/',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      wrapper = Wrapper()
      expect(wrapper.find('button.tab-control').findAll('a.item')[0].classes('active')).toBe(true)
    })

    it('sets second item active for /cockpit', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      mockedUsePageContext.mockReturnValue({
        urlPathname: '/cockpit',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      wrapper = Wrapper()
      expect(wrapper.find('button.tab-control').findAll('a.item')[1].classes('active')).toBe(true)
    })

    it('sets first item active for /somerandomroute', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      mockedUsePageContext.mockReturnValue({
        urlPathname: '/somerandomroute',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      wrapper = Wrapper()
      expect(wrapper.find('button.tab-control').findAll('a.item')[0].classes('active')).toBe(true)
    })
  })

  describe('tab control functionality', () => {
    it('has two menu items', () => {
      expect(wrapper.find('button.tab-control').findAll('a.item')).toHaveLength(2)
    })

    describe('set item', () => {
      beforeEach(async () => {
        await wrapper.findAll('a.item')[1].trigger('click')
      })

      it('changes active item', () => {
        expect(wrapper.findAll('a.item')[1].classes('active')).toBe(true)
      })
    })

    it('always shows all items', () => {
      const items = wrapper.findAll('a.item')
      expect(items).toHaveLength(2)
      items.forEach((item) => {
        expect(item.isVisible()).toBe(true)
      })
    })
  })
})
