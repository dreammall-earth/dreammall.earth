import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import FirstSection from './FirstSection.vue'

describe('FirstSection', () => {
  let wrapper
  const Wrapper = () => {
    return mount(FirstSection)
  }

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
      let item
      beforeEach(() => {
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
        expect(wrapper.vm.slide).toBe(0)
      })

      describe('video ends', () => {
        beforeEach(() => {
          wrapper.find('video').trigger('ended')
        })

        it('increments the slide value', () => {
          expect(wrapper.vm.slide).toBe(1)
        })
      })
    })

    describe('second item', () => {
      let item
      beforeEach(() => {
        wrapper.find('video').trigger('ended')
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
      let prevButton
      let nextButton

      beforeEach(() => {
        const buttons = wrapper.find('div.v-carousel__controls').findAll('button')
        prevButton = buttons[0]
        nextButton = buttons[1]
      })

      it('has slide value 0 at start', () => {
        expect(wrapper.vm.slide).toBe(0)
      })

      describe('click next', () => {
        beforeEach(() => {
          nextButton.trigger('click')
        })

        it('has slide value 1', () => {
          expect(wrapper.vm.slide).toBe(1)
        })

        describe('click prev', () => {
          beforeEach(() => {
            prevButton.trigger('click')
          })

          it('has slide value 0', () => {
            expect(wrapper.vm.slide).toBe(0)
          })
        })
      })
    })
  })
})
