import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import TextButtonInput from '#components/inputs/TextButtonInput.vue'
import AnchorLink from '#components/nav/AnchorLink.vue'

import FooterMenu from './FooterMenu.vue'
import LogoImage from './LogoImage.vue'

describe('FooterMenu', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(FooterMenu),
    },
  })

  it('renders four columns', () => {
    expect(wrapper.find('.v-row').exists()).toBeTruthy()
    expect(wrapper.findAll('.v-row > div')).toHaveLength(4)
  })

  describe('first column', () => {
    const column = wrapper.findAll('.v-row > div')[0]

    it('contains logo', () => {
      expect(column.findComponent(LogoImage)).toBeTruthy()
    })
  })

  describe('second column', () => {
    const column = wrapper.findAll('.v-row > div')[1]

    it('contains 4 children -> AnchorLink', () => {
      expect(column.findAllComponents(AnchorLink)).toHaveLength(4)
    })

    it('has header menu.header.sitemap', () => {
      expect(column.find('h2').text()).toBe("$t('menu.header.sitemap')")
    })

    describe('first anchor link', () => {
      const anchor = column.findAllComponents(AnchorLink)[0]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has text menu.home', () => {
        expect(anchor.text()).toBe("$t('menu.home')")
      })
    })

    describe('second anchor link', () => {
      const anchor = column.findAllComponents(AnchorLink)[1]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has text menu.worldCoffeeHouse', () => {
        expect(anchor.text()).toBe("$t('menu.worldCoffeeHouse')")
      })
    })

    describe('third anchor link', () => {
      const anchor = column.findAllComponents(AnchorLink)[2]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has class min-width-remover', () => {
        expect(anchor.classes('min-width-remover')).toBe(true)
      })

      it('has text menu.mall', () => {
        expect(anchor.text()).toBe("$t('menu.mall')")
      })
    })

    describe('fourth anchor link', () => {
      const anchor = column.findAllComponents(AnchorLink)[3]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has text menu.humansAndProjects', () => {
        expect(anchor.text()).toBe("$t('menu.humansAndProjects')")
      })
    })
  })

  describe('third column', () => {
    const column = wrapper.findAll('.v-row > div')[2]

    it('contains 4 children -> AnchorLink', () => {
      expect(column.findAllComponents(AnchorLink)).toHaveLength(4)
    })

    it('has header menu.header.contact', () => {
      expect(column.find('h2').text()).toBe("$t('menu.header.contact')")
    })

    describe('first anchor link', () => {
      const anchor = column.findAllComponents(AnchorLink)[0]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has text menu.eMail', () => {
        expect(anchor.text()).toBe("$t('menu.eMail')")
      })
    })

    describe('second anchor link', () => {
      const anchor = column.findAllComponents(AnchorLink)[1]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has text menu.linkedIn', () => {
        expect(anchor.text()).toBe("$t('menu.linkedIn')")
      })
    })

    describe('third anchor link', () => {
      const anchor = column.findAllComponents(AnchorLink)[2]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has text menu.instagram', () => {
        expect(anchor.text()).toBe("$t('menu.instagram')")
      })
    })

    describe('fourth anchor link', () => {
      const anchor = column.findAllComponents(AnchorLink)[3]

      it('has href to /', () => {
        expect(anchor.attributes('href')).toBe('/')
      })

      it('has class min-width-remover', () => {
        expect(anchor.classes('min-width-remover')).toBe(true)
      })

      it('has text menu.twitter', () => {
        expect(anchor.text()).toBe("$t('menu.twitter')")
      })
    })
  })

  describe('fourth column', () => {
    const column = wrapper.findAll('.v-row > div')[3]

    it('contains newsletterinput', () => {
      expect(column.findComponent(TextButtonInput)).toBeTruthy()
    })

    it('has header menu.header.newsletter', () => {
      expect(column.find('h2').text()).toBe("$t('menu.header.newsletter')")
    })

    it('has an input field', () => {
      expect(column.find('input').exists()).toBe(true)
    })

    it('has label menu.footer.textInputLabel', () => {
      expect(column.find('label').text()).toBe("$t('menu.footer.textInputLabel')")
    })

    it('has a button with text menu.footer.textInputButton', () => {
      expect(column.find('button').text()).toBe("$t('menu.footer.textInputButton')")
    })
  })
})
