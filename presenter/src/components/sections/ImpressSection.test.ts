import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { ComponentPublicInstance } from 'vue'

import ImpressSection from './ImpressSection.vue'

describe('ImpressSection', () => {
  let wrapper: VueWrapper<unknown, ComponentPublicInstance<unknown, Omit<unknown, never>>>
  const Wrapper = () => {
    return mount(ImpressSection)
  }

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders 5 cards', () => {
    expect(wrapper.find('.impress-section').exists()).toBeTruthy()
    expect(wrapper.findAll('.v-col > .v-card')).toHaveLength(5)
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
        "$t('impress.tax.content'): $t('impress.tax.id')",
      )
    })
  })

  describe('fourth card', () => {
    it('has h2 impress.euDispute.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[3].find('h2.card-header').text()).toBe(
        "$t('impress.euDispute.headline')",
      )
    })

    it('has p impress.euDispute.content', () => {
      expect(wrapper.findAll('.v-col > .v-card')[3].find('p.card-content').text()).toBe(
        "$t('impress.euDispute.content')",
      )
    })
  })

  describe('fifth card', () => {
    it('has h2 impress.consumerDispute.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[4].find('h2.card-header').text()).toBe(
        "$t('impress.consumerDispute.headline')",
      )
    })

    it('has p impress.consumerDispute.content', () => {
      expect(wrapper.findAll('.v-col > .v-card')[4].find('p.card-content').text()).toBe(
        "$t('impress.consumerDispute.content')",
      )
    })
  })
})
