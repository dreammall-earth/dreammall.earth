import { DOMWrapper, VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import FirstSection from './FirstSection.vue'

describe('FirstSection', () => {
  const Wrapper = () => {
    return mount(FirstSection)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders FirstSection', () => {
    expect(wrapper.find('.section1').exists()).toBeTruthy()
  })

  describe('carousel', () => {
    it('has two items', () => {
      expect(wrapper.findAllComponents({ name: 'VCarouselItem' })).toHaveLength(2)
    })

    describe('first item', () => {
      let item: VueWrapper
      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        item = wrapper.findAllComponents({ name: 'VCarouselItem' })[0]
      })

      it('contains a video', () => {
        expect(item.find('video').exists()).toBe(true)
      })

      it('has correct source', () => {
        expect(item.find('video').find('source').attributes('src')).toBe(
          '/src/assets/video/header_video.mp4',
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        item = wrapper.findAllComponents({ name: 'VCarouselItem' })[1]
      })

      it('has section-headline home.section1.headline', () => {
        expect(item.find('.section-headline').text()).toBe("$t('home.section1.headline')")
      })

      it('has a logo image with size large', () => {
        expect(item.findComponent({ name: 'LogoImage' }).exists()).toBe(true)
        expect(item.findComponent({ name: 'LogoImage' }).classes('logo-large')).toBe(true)
      })

      it('has section-subheadline home.section1.subHeadline', () => {
        expect(item.find('.section-subheadline').text()).toBe("$t('home.section1.subHeadline')")
      })

      it('has a button with text home.section1.preOrderBtn', () => {
        expect(item.find('button').text()).toBe("$t('home.section1.preOrderBtn')")
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
})
