import { DefaultApolloClient } from '@vue/apollo-composable'
import { mount, flushPromises } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { subscribeToNewsletterMutation } from '#mutations/subscribeToNewsletterMutation'

import NewsletterForm from './NewsletterForm.vue'

const mockClient = createMockClient()

const subscribeToNewsletterMutationMock = vi.fn()

describe('NewsletterForm', () => {
  const Wrapper = () => {
    return mount(NewsletterForm, {
      global: {
        provide: {
          [DefaultApolloClient]: mockClient,
        },
      },
    })
  }

  mockClient.setRequestHandler(
    subscribeToNewsletterMutation,
    subscribeToNewsletterMutationMock.mockResolvedValue({ data: { subscribeToNewsletter: true } }),
  )

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
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

    describe('lastname', () => {
      it('has text input', () => {
        expect(wrapper.find('input[name="lastname"][type="text"]').exists()).toBeTruthy()
      })

      it('has label home.newsletterSection.newsletterForm.lastname', () => {
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[2].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.lastname')",
        )
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[3].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.lastname')",
        )
      })
    })

    describe('email', () => {
      it('has email input', () => {
        expect(wrapper.find('input[name="email"][type="email"]').exists()).toBeTruthy()
      })

      it('has label home.newsletterSection.newsletterForm.email', () => {
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[4].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.email')",
        )
        expect(wrapper.findAll('form .v-text-field:not(.v-textarea) label')[5].text()).toBe(
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

  describe('submit', () => {
    describe('empty form', () => {
      beforeEach(async () => {
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
      })

      it('shows errors for all 4 fields', () => {
        const errorMessages = wrapper.findAll('.v-messages__message')
        expect(errorMessages).toHaveLength(4)
        // firstname
        expect(errorMessages[0].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.fieldRequired')",
        )
        // lastname
        expect(errorMessages[1].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.fieldRequired')",
        )
        // email
        expect(errorMessages[2].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.fieldRequired')",
        )
        // checkbox
        expect(errorMessages[3].text()).toBe(
          "$t('home.newsletterSection.newsletterForm.fieldRequired')",
        )
      })

      it('user feedback not visible', () => {
        expect(wrapper.find('span.info-text.form-success').exists()).toBe(false)
        expect(wrapper.find('span.info-text.form-error').exists()).toBe(false)
      })

      it('does not call the API', () => {
        expect(subscribeToNewsletterMutationMock).not.toBeCalled()
      })
    })

    describe('valid form', () => {
      beforeEach(async () => {
        await wrapper.find('input[name="firstname"]').setValue('Peter')
        await wrapper.find('input[name="lastname"]').setValue('Lustig')
        await wrapper.find('input[name="email"]').setValue('peter@lustig.de')
        await wrapper.find('input[name="dataprivacy"]').setValue(true)
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
      })

      describe('with success', () => {
        it('calls the API', () => {
          expect(subscribeToNewsletterMutationMock).toBeCalledWith({
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
            },
          })
        })

        it('resets the form', () => {
          expect(wrapper.find('input[name="firstname"]').element).toHaveProperty('value', '')
          expect(wrapper.find('input[name="lastname"]').element).toHaveProperty('value', '')
          expect(wrapper.find('input[name="email"]').element).toHaveProperty('value', '')
          expect(wrapper.find('input[name="dataprivacy"]').element).toHaveProperty('value', 'false')
        })

        describe('success message for user', () => {
          it('shows message', () => {
            expect(wrapper.find('span.info-text.form-success').exists()).toBeTruthy()

            expect(wrapper.find('span.info-text.form-success').text()).toBe(
              "$t('home.newsletterSection.newsletterForm.successMsg')",
            )
          })
        })
      })
    })
  })
})
