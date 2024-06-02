import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import TabControl from './TabControl.vue'

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
    vi.useFakeTimers()
    wrapper = Wrapper()
    vi.runAllTimers()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('click tab control button', () => {
    beforeEach(async () => {
      await wrapper.find('button.tab-control').trigger('click')
    })

    it('has three menu buttons', () => {
      expect(wrapper.find('button.tab-control').findAll('button')).toHaveLength(3)
    })

    describe('set item', () => {
      beforeEach(async () => {
        await wrapper.findAll('button.item')[1].trigger('click')
      })

      it('changes active item', () => {
        expect(wrapper.findAll('button.item')[1].classes('active')).toBe(true)
      })
    })

    describe('set item with menu closed', () => {
      beforeEach(async () => {
        vi.runAllTimers()
        await wrapper.findAll('button.item')[1].trigger('click')
      })

      it('does not change the active item', () => {
        expect(wrapper.findAll('button.item')[0].classes('active')).toBe(true)
      })
    })
  })

  describe('unmount', () => {
    const timeOutSpy = vi.spyOn(global.window, 'clearTimeout')

    beforeEach(() => {
      wrapper.unmount()
    })

    it('clears timouts', () => {
      expect(timeOutSpy).toBeCalled()
    })
  })
})
