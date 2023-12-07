import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import MainButton from './MainButton.vue'

describe('MainButton', () => {
  let wrapper
  const Wrapper = () => {
    return mount(MainButton, {
      props: {
        label: 'Button',
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

  describe('click on button', () => {
    it('emits click event', () => {
      wrapper.find('button').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('click', [[1]])
    })
  })

  describe('classes', () => {
    describe('size large', () => {
      it('sets class main-button-large', () => {
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-large')
      })
    })

    describe('size small', async () => {
      it('sets class main-button-small', async () => {
        await wrapper.setProps({ size: 'small' })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-small')
      })
    })

    // needed to catch the || branch
    describe('size empty string', async () => {
      it('sets class main-button-medium', async () => {
        await wrapper.setProps({ size: '' })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-medium')
      })
    })

    describe('size undefined', async () => {
      it('sets class main-button-medium', async () => {
        await wrapper.setProps({ size: undefined })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-medium')
      })
    })

    // is this behaviour wanted? Do we have to improve this?
    describe('size is some weird string', async () => {
      it('sets class main-button-medium', async () => {
        await wrapper.setProps({ size: 'some weird string' })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-some')
        expect(wrapper.find('.v-btn').classes()).toContain('weird')
        expect(wrapper.find('.v-btn').classes()).toContain('string')
      })
    })
  })
})
