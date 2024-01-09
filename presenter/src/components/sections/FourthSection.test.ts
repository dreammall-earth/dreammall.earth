import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import FourthSection from './FourthSection.vue'

describe('FourthSection', () => {
  const Wrapper = () => {
    return mount(FourthSection)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('reload button hidden', () => {
    expect(wrapper.findComponent({ name: 'MainButton' }).exists()).toBe(false)
  })

  describe('video ends', () => {
    beforeEach(async () => {
      await wrapper.find('video').trigger('ended')
    })

    it('reload button visible', () => {
      expect(wrapper.findComponent({ name: 'MainButton' }).exists()).toBe(true)
    })

    beforeEach(async () => {
      await wrapper.find('video').trigger('ended')
    })

    it('reload button click restarts video', async () => {
      await wrapper.findComponent({ name: 'MainButton' }).trigger('click')
      // TODO check if video is playing after button click
    })
  })
})
