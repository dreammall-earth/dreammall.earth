import { useMutation } from '@vue/apollo-composable'
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, SpyInstance } from 'vitest'

import { createContactFormMutation } from '#mutations/createContactForm'

import ContactForm from './ContactForm.vue'

describe('ContactForm', () => {
  const Wrapper = () => {
    return mount(ContactForm)
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders form', () => {
    expect(wrapper.find('form').exists()).toBeTruthy()
  })

  describe('inputs', () => {
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

  describe('submit', () => {
    let spy: SpyInstance
    beforeEach(() => {
      vi.clearAllMocks()
      spy = vi.spyOn(useMutation(createContactFormMutation), 'mutate')
    })

    describe('empty form', () => {
      beforeEach(async () => {
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
      })

      it('shows errors for all 5 fields', () => {
        const errorMessages = wrapper.findAll('.v-messages__message')
        expect(errorMessages).toHaveLength(5)
        // firstname
        expect(errorMessages[0].text()).toBe("$t('menu.footer.contactForm.fieldRequired')")
        // email
        expect(errorMessages[1].text()).toBe("$t('menu.footer.contactForm.fieldRequired')")
        // lastname
        expect(errorMessages[2].text()).toBe("$t('menu.footer.contactForm.fieldRequired')")
        // content
        expect(errorMessages[3].text()).toBe("$t('menu.footer.contactForm.fieldRequired')")
        // checkbox
        expect(errorMessages[4].text()).toBe("$t('menu.footer.contactForm.fieldRequired')")
      })

      it('does not call the API', () => {
        expect(spy).not.toBeCalled()
      })
    })

    describe('valid form', () => {
      beforeEach(async () => {
        spy.mockImplementation(() => ({
          data: { createContactForm: true },
        }))
        await wrapper.find('input[name="firstname"]').setValue('Peter')
        await wrapper.find('input[name="email"]').setValue('peter@lustig.de')
        await wrapper.find('input[name="lastname"]').setValue('Lustig')
        await wrapper.find('textarea[name="message"]').setValue('Eine gute Frage.')
        await wrapper.find('input[name="dataprivacy"]').setValue(true)
        await wrapper.find('form').trigger('submit.prevent')
      })

      it.skip('calls the API', () => {
        expect(spy).toBeCalledWith({
          data: {
            firstName: 'Peter',
            lastName: 'Lustig',
            email: 'peter@lustig.de',
            content: 'Eine gute Frage.',
          },
        })
      })
    })
  })
})
