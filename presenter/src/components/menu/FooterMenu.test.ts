import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

// import TextButtonInput from '#components/inputs/TextButtonInput.vue'
import ContactForm from '#components/inputs/ContactForm.vue'
import AnchorLink from '#components/nav/AnchorLink.vue'

import FooterMenu from './FooterMenu.vue'
import LogoImage from './LogoImage.vue'

describe('FooterMenu', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(FooterMenu as Component),
    },
  })

  it('renders three columns', () => {
    expect(wrapper.find('.v-row').exists()).toBeTruthy()
    expect(wrapper.findAll('.footer.v-row > div')).toHaveLength(3)
  })

  describe('first column', () => {
    const column = wrapper.findAll('.v-row > div')[0]

    it('contains 3 children -> AnchorLink', () => {
      expect(column.findAllComponents(AnchorLink)).toHaveLength(3)
    })

    it('has header menu.footer.sitemap', () => {
      expect(column.find('h2').text()).toBe("$t('menu.footer.sitemap')")
    })

    describe('first anchor link', () => {
      const anchor: VueWrapper = (column.findAllComponents(AnchorLink) as VueWrapper[])[0]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has text menu.home', () => {
        expect(anchor.text()).toBe("$t('menu.footer.home')")
      })
    })

    describe('second anchor link', () => {
      const anchor: VueWrapper = (column.findAllComponents(AnchorLink) as VueWrapper[])[1]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/#planning-section')
      })

      it('has text menu.footer.planing', () => {
        expect(anchor.text()).toBe("$t('menu.footer.planing')")
      })
    })

    describe('third anchor link', () => {
      const anchor: VueWrapper = (column.findAllComponents(AnchorLink) as VueWrapper[])[2]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/#coffee-section')
      })

      it('has text menu.worldCoffeeHouse', () => {
        expect(anchor.text()).toBe("$t('menu.footer.worldCoffeeHouse')")
      })
    })
  })

  describe('second column', () => {
    const column = wrapper.findAll('.v-row > div')[1]

    it('contains logo', () => {
      expect(column.findComponent(LogoImage)).toBeTruthy()
    })

    it('contains 3 children -> AnchorLink', () => {
      expect(column.findAllComponents(AnchorLink)).toHaveLength(3)
    })

    it('has header menu.footer.privacyHeadline', () => {
      expect(column.find('h2').text()).toBe("$t('menu.footer.privacyHeadline')")
    })

    describe('first anchor link', () => {
      const anchor: VueWrapper = (column.findAllComponents(AnchorLink) as VueWrapper[])[0]

      it('has href to /impressum', () => {
        expect(anchor.attributes('href')).toBe('/impressum')
      })

      it('has text menu.footer.impress', () => {
        expect(anchor.text()).toBe("$t('menu.footer.impress')")
      })
    })

    describe('second anchor link', () => {
      const anchor: VueWrapper = (column.findAllComponents(AnchorLink) as VueWrapper[])[1]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/#newsletter-section')
      })

      it('has text menu.footer.newsletter', () => {
        expect(anchor.text()).toBe("$t('menu.footer.newsletter')")
      })
    })

    describe('third anchor link', () => {
      const anchor: VueWrapper = (column.findAllComponents(AnchorLink) as VueWrapper[])[2]

      it('has href to /datenschutz', () => {
        expect(anchor.attributes('href')).toBe('/datenschutz')
      })

      it('has text menu.footer.privacy', () => {
        expect(anchor.text()).toBe("$t('menu.footer.privacy')")
      })
    })
  })

  describe('third column', () => {
    const column = wrapper.findAll('.v-row > div')[2]

    it('contains contactform', () => {
      expect(column.findComponent(ContactForm)).toBeTruthy()
    })

    it('has header menu.footer.contact', () => {
      expect(column.find('h2').text()).toBe("$t('menu.footer.contact')")
    })
  })
})
