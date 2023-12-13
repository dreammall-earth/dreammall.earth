import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import MainButton from './MainButton.vue'

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
    expect(wrapper.find('.v-btn').exists()).toBeTruthy()
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
