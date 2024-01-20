import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, MockInstance } from 'vitest'

import FourthSection from './FourthSection.vue'

describe('FourthSection', () => {
  const Wrapper = (width: number = 1024) => {
    global.window.innerWidth = width
    return mount(FourthSection)
  }
  let wrapper: VueWrapper<InstanceType<typeof FourthSection>>

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

    it('shows replay button', () => {
      expect(wrapper.findComponent({ name: 'MainButton' }).exists()).toBe(true)
    })

    describe('click replay button', () => {
      let spy: MockInstance

      beforeEach(async () => {
        vi.clearAllMocks()
        ;(wrapper.vm as unknown as { video: HTMLFormElement }).video.ended = true
        spy = vi.spyOn((wrapper.vm as unknown as { video: HTMLFormElement }).video, 'play')
        await wrapper.findComponent({ name: 'MainButton' }).trigger('click')
      })

      it('plays video again', () => {
        expect(spy).toBeCalled()
      })
    })
  })

  describe('video source and poster', () => {
    describe('desktop', () => {
      it('has desktop video and poster', () => {
        expect(wrapper.find('source[type="video/mp4"]').attributes('src')).toBe(
          '/src/assets/video/timeline_quer.mp4',
        )
        expect(wrapper.find('source[type="video/webm"]').attributes('src')).toBe(
          '/src/assets/video/timeline_quer.webm',
        )
        expect(wrapper.find('video').attributes('poster')).toBe(
          '/src/assets/img/timeline_thumbnail_quer.jpg',
        )
      })
    })

    describe('mobile', () => {
      beforeEach(() => {
        wrapper = Wrapper(500)
      })

      it('has mobile video and poster', () => {
        expect(wrapper.find('source[type="video/mp4"]').attributes('src')).toBe(
          '/src/assets/video/timeline_hoch.mp4',
        )
        expect(wrapper.find('source[type="video/webm"]').attributes('src')).toBe(
          '/src/assets/video/timeline_hoch.webm',
        )
        expect(wrapper.find('video').attributes('poster')).toBe(
          '/src/assets/img/timeline_thumbnail_hoch.jpg',
        )
      })
    })
  })

  describe('resize window', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events: { [key: string]: any } = {}
    let spy: MockInstance

    beforeEach(() => {
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      global.window.addEventListener = vi.fn((event, callback) => {
        // eslint-disable-next-line security/detect-object-injection
        events[event] = callback
      })
      wrapper = Wrapper()

      spy = vi.spyOn(
        (wrapper.vm as unknown as { videoSrcControl: { setVideoSrc: () => void } }).videoSrcControl,
        'setVideoSrc',
      )
    })

    it('calls etVideoSrc', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      events.resize()
      expect(spy).toBeCalled()
    })
  })
})
