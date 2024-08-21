import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import LogoImage from './LogoImage.vue'

describe('LogoImage', () => {
  const Wrapper = (props = {}) => {
    return mount(VApp, {
      slots: {
        default: h(LogoImage as Component, props),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders Logo', () => {
    expect(wrapper.findComponent(LogoImage).element).toMatchSnapshot()
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
      beforeEach(() => {
        wrapper = Wrapper({ size: 'large' })
      })

      it('has class logo-large', () => {
        expect(wrapper.find('.v-img').classes('logo-medium')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-large')).toBe(true)
      })
    })

    describe('size medium', () => {
      beforeEach(() => {
        wrapper = Wrapper({ size: 'medium' })
      })

      it('has class logo-medium', () => {
        expect(wrapper.find('.v-img').classes('logo-large')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-medium')).toBe(true)
      })
    })

    describe('size small', () => {
      beforeEach(() => {
        wrapper = Wrapper({ size: 'small' })
      })

      it('has class logo-small', () => {
        expect(wrapper.find('.v-img').classes('logo-large')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-medium')).toBe(false)
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(true)
      })
    })
  })
})
