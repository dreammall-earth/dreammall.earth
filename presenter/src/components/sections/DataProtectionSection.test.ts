import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import DataProtectionSection from './DataProtectionSection.vue'

describe('DataProtectionSection', () => {
  const Wrapper = () => {
    return mount(DataProtectionSection)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders 4 cards', () => {
    expect(wrapper.find('.data-protection-section').exists()).toBeTruthy()
    expect(wrapper.findAll('.v-col > .v-card')).toHaveLength(4)
  })

  it('has h1 dataProtection.headline', () => {
    expect(wrapper.find('.data-protection-section h1.section-headline').text()).toBe(
      "$t('dataProtection.headline')",
    )
  })

  describe('first card', () => {
    it('has h2 dataProtection.general.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[0].findAll('h2.card-header')[0].text()).toBe(
        "$t('dataProtection.general.headline')",
      )
    })
  })

  describe('second card', () => {
    it('has h2 dataProtection.processing.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[1].find('h2.card-header').text()).toBe(
        "$t('dataProtection.processing.headline')",
      )
    })
  })

  describe('third card', () => {
    it('has h2 dataProtection.revocation.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[2].find('h2.card-header').text()).toBe(
        "$t('dataProtection.revocation.headline')",
      )
    })

    it('has p dataProtection.revocation.content', () => {
      expect(wrapper.findAll('.v-col > .v-card')[2].find('p.card-content').text()).toBe(
        "$t('dataProtection.revocation.content')",
      )
    })
  })

  describe('fourth card', () => {
    it('has h2 dataProtection.euDispute.headline', () => {
      expect(wrapper.findAll('.v-col > .v-card')[3].find('h2.card-header').text()).toBe(
        "$t('dataProtection.euDispute.headline')",
      )
    })

    it('has p dataProtection.euDispute.content', () => {
      expect(wrapper.findAll('.v-col > .v-card')[3].find('p.card-content').text()).toBe(
        "$t('dataProtection.euDispute.content')",
      )
    })
  })
})
