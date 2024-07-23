import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import LogoImage from './LogoImage.vue'

describe('LogoImage', () => {
  const Wrapper = () => {
    return mount(LogoImage)
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders Logo', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('classes', () => {
    describe('default', () => {
      it('has class logo-medium', () => {
        expect(wrapper.find('.v-img').classes('logo-large')).toBeFalsy()
        expect(wrapper.find('.v-img').classes('logo-small')).toBeFalsy()
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
        expect(wrapper.find('.v-img').classes('logo-medium')).toBeFalsy()
        expect(wrapper.find('.v-img').classes('logo-small')).toBeFalsy()
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
        expect(wrapper.find('.v-img').classes('logo-large')).toBeFalsy()
        expect(wrapper.find('.v-img').classes('logo-small')).toBeFalsy()
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
        expect(wrapper.find('.v-img').classes('logo-large')).toBeFalsy()
        expect(wrapper.find('.v-img').classes('logo-medium')).toBeFalsy()
        expect(wrapper.find('.v-img').classes('logo-small')).toBe(true)
      })
    })
  })
})
