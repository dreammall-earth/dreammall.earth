import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import ImpressSection from './ImpressSection.vue'

describe('ImpressSection', () => {
  const Wrapper = () => {
    return mount(ImpressSection)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders 7 cards', () => {
    expect(wrapper.find('.impress-section').exists()).toBeTruthy()
    expect(wrapper.findAll('.v-col > .v-card')).toHaveLength(7)
  })

  it('has h1 impress.headline', () => {
    expect(wrapper.find('.impress-section h1.section-headline').text()).toBe(
      "$t('impress.headline')",
    )
  })

  describe('first card', () => {
    it('has h2 impress.data.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[0].findAll('h2.card-header')[0].text()).toBe(
        "$t('impress.data.headline')",
      )
    })

    it('has h2 impress.data.personHeadline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[0].findAll('h2.card-header')[1].text()).toBe(
        "$t('impress.data.personHeadline')",
      )
    })
  })

  describe('second card', () => {
    it('has h2 impress.contact.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[1].find('h2.card-header').text()).toBe(
        "$t('impress.contact.headline')",
      )
    })
  })

  describe('third card', () => {
    it('has h2 impress.tax.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[2].find('h2.card-header').text()).toBe(
        "$t('impress.tax.headline')",
      )
    })

    it('has p impress.tax.content & impress.tax.id', () => {
      expect(wrapper.findAll('.v-col > .v-card')[2].find('p.card-content').text()).toBe(
        "$t('impress.tax.content')$t('impress.tax.id')",
      )
    })
  })

  describe('fourth card', () => {
    it('has h2 impress.liabilityContent.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[3].find('h2.card-header').text()).toBe(
        "$t('impress.liabilityContent.headline')",
      )
    })

    it('has p impress.liabilityContent.content', () => {
      expect(wrapper.findAll('.v-col > .v-card')[3].find('p.card-content').text()).toBe(
        "$t('impress.liabilityContent.content')",
      )
    })
  })

  describe('fifth card', () => {
    it('has h2 impress.liabilityLinks.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[4].find('h2.card-header').text()).toBe(
        "$t('impress.liabilityLinks.headline')",
      )
    })

    it('has p impress.liabilityLinks.content', () => {
      expect(wrapper.findAll('.v-col > .v-card')[4].find('p.card-content').text()).toBe(
        "$t('impress.liabilityLinks.content')",
      )
    })
  })

  describe('sixth card', () => {
    it('has h2 impress.copyright.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[5].find('h2.card-header').text()).toBe(
        "$t('impress.copyright.headline')",
      )
    })

    it('has p impress.copyright.content', () => {
      expect(wrapper.findAll('.v-col > .v-card')[5].find('p.card-content').text()).toBe(
        "$t('impress.copyright.content')",
      )
    })
  })

  describe('seventh card', () => {
    it('has h2 impress.legalDisclaimer.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[6].find('h2.card-header').text()).toBe(
        "$t('impress.legalDisclaimer.headline')",
      )
    })

    it('has p impress.legalDisclaimer.content', () => {
      expect(wrapper.findAll('.v-col > .v-card')[6].find('p.card-content').text()).toBe(
        "$t('impress.legalDisclaimer.content')",
      )
    })
  })
})
