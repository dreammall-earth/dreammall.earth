import { DOMWrapper, VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, MockInstance } from 'vitest'

import IntroSection from './IntroSection.vue'

describe('IntroSection', () => {
  const Wrapper = (width: number = 1024) => {
    global.window.innerWidth = width
    return mount(IntroSection)
  }
  let wrapper: VueWrapper<InstanceType<typeof IntroSection>>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders IntroSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('carousel', () => {
    it('has two items', () => {
      expect(wrapper.findAllComponents({ name: 'VCarouselItem' })).toHaveLength(2)
    })

    describe('first item', () => {
      let item: VueWrapper
      beforeEach(() => {
        item = (wrapper.findAllComponents({ name: 'VCarouselItem' }) as VueWrapper[])[0]
      })

      it('contains a video', () => {
        expect(item.find('video').exists()).toBe(true)
      })

      it('has correct source', () => {
        expect(item.find('video').find('source').attributes('src')).toBe(
          '/src/assets/video/intro_quer.mp4',
        )
      })

      it('has slide value 0', () => {
        expect((wrapper.vm as unknown as { slide: number }).slide).toBe(0)
      })

      describe('video ends', () => {
        beforeEach(async () => {
          await wrapper.find('video').trigger('ended')
        })

        it('increments the slide value', () => {
          expect((wrapper.vm as unknown as { slide: number }).slide).toBe(1)
        })
      })
    })

    describe('second item', () => {
      let item: VueWrapper
      beforeEach(async () => {
        await wrapper.find('video').trigger('ended')
        item = (wrapper.findAllComponents({ name: 'VCarouselItem' }) as VueWrapper[])[1]
      })

      it('has section-headline home.introSection.headline', () => {
        expect(item.find('.section-headline').text()).toBe("$t('home.introSection.headline')")
      })

      it('has a logo image with size large', () => {
        expect(item.findComponent({ name: 'LogoImage' }).exists()).toBe(true)
        expect(item.findComponent({ name: 'LogoImage' }).classes('logo-large')).toBe(true)
      })

      it('has section-subheadline home.introSection.subHeadline', () => {
        expect(item.find('.section-subheadline').text()).toBe("$t('home.introSection.subHeadline')")
      })

      it('has a button with text home.introSection.preOrderBtn', () => {
        expect(item.find('.v-btn').find('.main-button-content').text()).toBe(
          "$t('home.introSection.preOrderBtn')",
        )
      })
    })

    describe('carousel buttons', () => {
      let prevButton: DOMWrapper<HTMLButtonElement>
      let nextButton: DOMWrapper<HTMLButtonElement>

      beforeEach(() => {
        const buttons = wrapper.find('div.v-carousel__controls').findAll('button')
        prevButton = buttons[0]
        nextButton = buttons[1]
      })

      it('has slide value 0 at start', () => {
        expect((wrapper.vm as unknown as { slide: number }).slide).toBe(0)
      })

      describe('click next', () => {
        beforeEach(async () => {
          await nextButton.trigger('click')
        })

        it('has slide value 1', () => {
          expect((wrapper.vm as unknown as { slide: number }).slide).toBe(1)
        })

        describe('click prev', () => {
          beforeEach(async () => {
            await prevButton.trigger('click')
          })

          it('has slide value 0', () => {
            expect((wrapper.vm as unknown as { slide: number }).slide).toBe(0)
          })
        })
      })
    })
  })

  describe('play video', () => {
    let spy: MockInstance

    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('video did not end', () => {
      beforeEach(async () => {
        spy = vi.spyOn((wrapper.vm as unknown as { video: HTMLFormElement }).video, 'play')
        await wrapper.find('video').trigger('click')
      })

      it('does not play the video', () => {
        expect(spy).not.toBeCalled()
      })
    })

    describe('video ended', () => {
      beforeEach(async () => {
        ;(wrapper.vm as unknown as { video: HTMLFormElement }).video.ended = true

        spy = vi.spyOn((wrapper.vm as unknown as { video: HTMLFormElement }).video, 'play')
        await wrapper.find('video').trigger('click')
      })

      it('plays the video', () => {
        expect(spy).toBeCalled()
      })
    })
  })

  describe('video source and poster', () => {
    describe('desktop', () => {
      it('has desktop video and poster', () => {
        expect(wrapper.find('source[type="video/mp4"]').attributes('src')).toBe(
          '/src/assets/video/intro_quer.mp4',
        )
        expect(wrapper.find('source[type="video/webm"]').attributes('src')).toBe(
          '/src/assets/video/intro_quer.webm',
        )
        expect(wrapper.find('video').attributes('poster')).toBe(
          '/src/assets/img/intro_thumbnail_quer.jpg',
        )
      })
    })

    describe('mobile', () => {
      beforeEach(() => {
        wrapper = Wrapper(600)
      })

      it('has mobile video and poster', () => {
        expect(wrapper.find('source[type="video/mp4"]').attributes('src')).toBe(
          '/src/assets/video/intro_hoch.mp4',
        )
        expect(wrapper.find('source[type="video/webm"]').attributes('src')).toBe(
          '/src/assets/video/intro_hoch.webm',
        )
        expect(wrapper.find('video').attributes('poster')).toBe(
          '/src/assets/img/intro_thumbnail_hoch.jpg',
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
