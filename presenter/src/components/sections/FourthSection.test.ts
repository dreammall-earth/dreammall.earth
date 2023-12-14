import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { ComponentPublicInstance } from 'vue'

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
    expect(wrapper.find('.section4').exists()).toBeTruthy()
  })

  it('has section-headline home.section4.headline', () => {
    expect(wrapper.find('h2.section-headline').text()).toBe("$t('home.section4.headline')")
  })

  it('contains a video', () => {
    expect(wrapper.find('video').exists()).toBe(true)
  })

  it('has correct source', () => {
    expect(wrapper.find('video').find('source').attributes('src')).toBe(
      '/src/assets/video/timeline.mp4',
    )
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
