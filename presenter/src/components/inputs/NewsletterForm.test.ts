import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

import NewsletterForm from './NewsletterForm.vue'

describe('NewsletterForm', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(NewsletterForm),
    },
  })

  it('renders form', () => {
    expect(wrapper.find('form').exists()).toBeTruthy()
  })

  describe('renders correct inputs', () => {
    describe('firstname', () => {
      it('has text input', () => {
        expect(wrapper.find('input[name="firstname"][type="text"]').exists()).toBeTruthy()
      })

      it('has label home.newsletterSection.newsletterForm.firstname', () => {
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[0].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.firstname')",
        )
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[1].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.firstname')",
        )
      })
    })

    describe('email', () => {
      it('has email input', () => {
        expect(wrapper.find('input[name="email"][type="email"]').exists()).toBeTruthy()
      })

      it('has label home.newsletterSection.newsletterForm.email', () => {
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[2].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.email')",
        )
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[3].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.email')",
        )
      })
    })

    describe('dataprivacy', () => {
      it('has checkbox input', () => {
        expect(wrapper.find('input[type="checkbox"][name="dataprivacy"]').exists()).toBeTruthy()
      })

      it('has label home.newsletterSection.newsletterForm.privacy & privacyLinkLabel', () => {
        expect(wrapper.find('form .v-row .v-col span.newsletter-agb').text()).toBe(
          "$t('home.newsletterSection.newsletterForm.privacy') $t('home.newsletterSection.newsletterForm.privacyLinkLabel')",
        )
      })
    })
  })

  describe('form submit', () => {
    it('inputs not filled', async () => {
      // form is empty not to be submitted
      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.emitted()).toHaveProperty('submit')
    })

    it('data privacy checkbox not checked', async () => {
      // form not to be submitted
      await wrapper.find('input[type=text][name="firstname"]').setValue('John')
      await wrapper.find('input[type=email]').setValue('john@doe.com')

      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.emitted()).toHaveProperty('submit')
    })

    it('form is valid', async () => {
      // form be submitted if inputs filled
      await wrapper.find('input[type="checkbox"][name="dataprivacy"]').setValue()
      expect(wrapper.emitted()).toHaveProperty('submit')
    })
  })
})
