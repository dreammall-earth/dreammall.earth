import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { ComponentPublicInstance } from 'vue'

import MainButton from './MainButton.vue'

describe('MainButton', () => {
  let wrapper: VueWrapper<unknown, ComponentPublicInstance<unknown, Omit<unknown, never>>>
  const Wrapper = () => {
    return mount(MainButton, {
      props: {
        label: 'My Button',
        variant: 'primary',
        size: 'large',
      },
    })
  }

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.find('.v-btn').exists()).toBeTruthy()
  })

  it('icon is hidden', () => {
    expect(wrapper.find('.v-icon').exists()).toBe(false)
  })

  describe('click on button', () => {
    it('emits click event', async () => {
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('click', [[1]])
    })
  })

  describe('label', () => {
    it('renders My Button', () => {
      expect(wrapper.find('.v-btn').text()).toEqual('My Button')
    })
  })

  describe('variant reload', () => {
    it('icon is visible', async () => {
      await wrapper.setProps({ size: 'auto', variant: 'reload' })
      expect(wrapper.find('.v-icon').exists()).toBe(true)
    })
  })

  describe('classes', () => {
    describe('size large', () => {
      it('sets class main-button-large', () => {
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-large')
      })
    })

    describe('size small', () => {
      it('sets class main-button-small', async () => {
        await wrapper.setProps({ size: 'small' })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-small')
      })
    })

    // needed to catch the || branch
    describe('size empty string', () => {
      it('sets class main-button-medium', async () => {
        await wrapper.setProps({ size: '' })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-medium')
      })
    })

    describe('size undefined', () => {
      it('sets class main-button-medium', async () => {
        await wrapper.setProps({ size: undefined })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-medium')
      })
    })

    // is this behaviour wanted? Do we have to improve this?
    describe('size is some weird string', () => {
      it('sets strange classes', async () => {
        await wrapper.setProps({ size: 'some weird string' })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-some')
        expect(wrapper.find('.v-btn').classes()).toContain('weird')
        expect(wrapper.find('.v-btn').classes()).toContain('string')
      })
    })
  })
})
