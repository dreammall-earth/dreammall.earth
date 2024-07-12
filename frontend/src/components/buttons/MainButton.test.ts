import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import MainButton from './MainButton.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => (r + r + g + g + b + b) as string)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return ''
  }
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

describe('MainButton', () => {
  const Wrapper = () => {
    return mount(MainButton, {
      props: {
        label: 'My Button',
        variant: 'primary',
        size: 'large',
      },
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('icon is hidden', () => {
    expect(wrapper.find('.v-icon').exists()).toBe(false)
  })

  describe('click on button', () => {
    it('emits click event', async () => {
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('click', [[1]])
    })

    describe('when href is provided', () => {
      beforeEach(() => {
        wrapper = mount(MainButton, {
          props: {
            label: 'My Button',
            href: '/some-path',
            variant: 'primary',
            size: 'large',
          },
        })
      })

      it('calls navigate method with given href', async () => {
        await wrapper.find('button').trigger('click')
        expect(navigate).toHaveBeenCalledWith('/some-path')
      })

      it('emits click event', async () => {
        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click', [[1]])
      })
    })
  })

  describe('label', () => {
    it('renders My Button', () => {
      expect(wrapper.find('.v-btn').text()).toEqual('My Button')
    })
  })

  describe('variant reload', () => {
    it('icon is visible', async () => {
      await wrapper.setProps({ size: 'auto', variant: 'reload', label: 'My Button' })
      expect(wrapper.find('.v-icon').exists()).toBe(true)
    })

    it('shows circular loading', async () => {
      await wrapper.setProps({
        size: 'auto',
        variant: 'reload',
        label: 'My Button',
        isLoading: true,
      })
      expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
    })
  })

  describe('bg color', () => {
    it('is primary bg color', () => {
      expect(wrapper.find('.v-btn.main-button--primary').attributes('style')).toContain(
        hexToRgb('#f09630'),
      )
    })

    it('sets variant to secondary', async () => {
      await wrapper.setProps({ label: 'My Button', variant: 'secondary', size: 'small' })
      expect(wrapper.find('.v-btn.main-button--secondary').attributes('style')).toContain(
        hexToRgb('#767676'),
      )
    })

    it('sets variant to third', async () => {
      await wrapper.setProps({ label: 'My Button', variant: 'third', size: 'small' })
      expect(wrapper.find('.v-btn.main-button--third').attributes('style')).toContain(
        hexToRgb('#3d4753'),
      )
    })

    it('sets variant to third-inverse', async () => {
      await wrapper.setProps({ label: 'My Button', variant: 'third-inverse', size: 'small' })
      expect(wrapper.find('.main-button--third-inverse').classes()).toContain('bg-transparent')
    })

    it('sets variant to fourth', async () => {
      await wrapper.setProps({ label: 'My Button', variant: 'fourth', size: 'small' })
      expect(wrapper.find('.main-button--fourth').attributes('style')).toContain(
        hexToRgb('#2ca5b1'),
      )
    })

    it('sets variant to submit', async () => {
      await wrapper.setProps({ label: 'My Button', variant: 'submit', size: 'small' })
      expect(wrapper.find('.main-button--form-submit').attributes('style')).toContain(
        hexToRgb('#23ad5b'),
      )
    })

    it('sets variant to download', async () => {
      await wrapper.setProps({ label: 'My Button', variant: 'download', size: 'small' })
      expect(wrapper.find('.v-btn.main-button--download').attributes('style')).toContain(
        hexToRgb('#009dd9'),
      )
    })

    it('sets variant to undefined value', async () => {
      await wrapper.setProps({ label: 'My Button', variant: undefined, size: 'small' })
      expect(wrapper.find('.v-btn.main-button').attributes('style')).toContain(hexToRgb('#f09630'))
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
        await wrapper.setProps({ label: 'My Button', variant: 'primary', size: 'small' })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-small')
      })
    })

    describe('size undefined', () => {
      it('sets class main-button-medium', async () => {
        await wrapper.setProps({ label: 'My Button', variant: 'primary', size: undefined })
        expect(wrapper.find('.v-btn').classes()).toContain('main-button-medium')
      })
    })
  })
})
