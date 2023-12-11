import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import LogoImage from './LogoImage.vue'

describe('LogoImage', () => {
  let wrapper

  const Wrapper = () => {
    return mount(LogoImage)
  }

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders Logo', () => {
    expect(wrapper.find('.v-img').exists()).toBeTruthy()
    expect(wrapper.find('.v-img__img').attributes().src).toBe('/src/assets/dreammall-logo.svg')
  })

  describe('classes', () => {
    describe('default', () => {
      it('has class logo-medium', () => {
        expect(wrapper.find('.v-img').classes('logo-large')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-medium')).toBe(true)
      })
    })

    describe('size large', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          size: 'large',
        })
      })

      it('has class logo-large', () => {
        expect(wrapper.find('.v-img').classes('logo-medium')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-large')).toBe(true)
      })
    })

    describe('size medium', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          size: 'medium',
        })
      })

      it('has class logo-medium', () => {
        expect(wrapper.find('.v-img').classes('logo-large')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-medium')).toBe(true)
      })
    })

    describe('size small', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          size: 'small',
        })
      })

      it('has class logo-small', () => {
        expect(wrapper.find('.v-img').classes('logo-large')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-medium')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(true)
      })
    })

    describe('unexpected size', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          size: 'unexpected',
        })
      })

      it('has no logo size class', () => {
        expect(wrapper.find('.v-img').classes('logo-large')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-medium')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(false)
      })
    })
  })
})
