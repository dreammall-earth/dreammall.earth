import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import ContactForm from './ContactForm.vue'

describe('ContactForm', () => {
  const wrapper = mount(VApp, {
    slots: {
      default: h(ContactForm as Component),
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

      it('has label menu.footer.contactForm.firstName', () => {
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[0].text()).toBe(
          "$t('menu.footer.contactForm.firstName')",
        )
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[1].text()).toBe(
          "$t('menu.footer.contactForm.firstName')",
        )
      })
    })

    describe('lastname', () => {
      it('has text input', () => {
        expect(wrapper.find('input[name="lastname"][type="text"]').exists()).toBeTruthy()
      })

      it('has label menu.footer.contactForm.lastName', () => {
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[4].text()).toBe(
          "$t('menu.footer.contactForm.lastName')",
        )
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[5].text()).toBe(
          "$t('menu.footer.contactForm.lastName')",
        )
      })
    })

    describe('email', () => {
      it('has email input', () => {
        expect(wrapper.find('input[name="email"][type="email"]').exists()).toBeTruthy()
      })

      it('has label menu.footer.contactForm.mail', () => {
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[2].text()).toBe(
          "$t('menu.footer.contactForm.mail')",
        )
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[3].text()).toBe(
          "$t('menu.footer.contactForm.mail')",
        )
      })
    })

    describe('message', () => {
      it('has textarea input', () => {
        expect(wrapper.find('textarea[name="message"]').exists()).toBeTruthy()
      })

      it('has label menu.footer.contactForm.message', () => {
        expect(wrapper.find('form .v-textarea.v-text-field label').text()).toBe(
          "$t('menu.footer.contactForm.message')",
        )
      })
    })

    describe('dataprivacy', () => {
      it('has checkbox input', () => {
        expect(wrapper.find('input[type="checkbox"][name="dataprivacy"]').exists()).toBeTruthy()
      })

      it('has label menu.footer.contactForm.message', () => {
        expect(wrapper.find('form .v-row .v-col span.contact-agb').text()).toBe(
          "$t('menu.footer.contactForm.privacy') $t('menu.footer.contactForm.privacyLinkLabel')",
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
      await wrapper.find('input[type=text][name="lastname"]').setValue('Doe')
      await wrapper.find('input[type=email]').setValue('john@doe.com')
      await wrapper.find('textarea[name="message"]').setValue('Lorem ipsum dolor sit amet')

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
