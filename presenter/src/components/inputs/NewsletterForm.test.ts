import { DefaultApolloClient } from '@vue/apollo-composable'
import { mount, flushPromises } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

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
    expect(wrapper.element).toMatchSnapshot()
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
        expect(errorMessages[0].text()).toBe('Dieses Feld wird benötigt')
        // lastname
        expect(errorMessages[1].text()).toBe('Dieses Feld wird benötigt')
        // email
        expect(errorMessages[2].text()).toBe('Dieses Feld wird benötigt')
        // checkbox
        expect(errorMessages[3].text()).toBe("$t('validation.fieldRequired')")
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
        vi.useFakeTimers()
        await wrapper.find('input[name="firstname"]').setValue('Peter')
        await wrapper.find('input[name="lastname"]').setValue('Lustig')
        await wrapper.find('input[name="email"]').setValue('peter@lustig.de')
        await wrapper.find('input[name="dataprivacy"]').setValue(true)
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      describe('with success', () => {
        beforeEach(async () => {
          await wrapper.find('form').trigger('submit.prevent')
          await flushPromises()
        })

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
          expect(wrapper.find('input[name="dataprivacy"]').element).toHaveProperty('checked', false)
        })

        describe('success message for user', () => {
          it('shows message', () => {
            expect(wrapper.find('span.info-text.form-success').exists()).toBe(true)

            expect(wrapper.find('span.info-text.form-success').text()).toBe(
              "$t('home.newsletterSection.newsletterForm.successMsg')",
            )
          })

          describe('run timers', () => {
            beforeEach(() => {
              vi.runAllTimers()
            })

            it('does not show the message anymore', () => {
              expect(wrapper.find('span.info-text.form-success').exists()).toBe(false)
            })
          })
        })
      })

      describe('with error', () => {
        beforeEach(async () => {
          subscribeToNewsletterMutationMock.mockRejectedValue({ message: 'Ouch!' })
          await wrapper.find('form').trigger('submit.prevent')
          await flushPromises()
        })

        it('calls the API', () => {
          expect(subscribeToNewsletterMutationMock).toBeCalledWith({
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
            },
          })
        })

        it('does not reset the form', () => {
          expect(wrapper.find('input[name="firstname"]').element).toHaveProperty('value', 'Peter')
          expect(wrapper.find('input[name="email"]').element).toHaveProperty(
            'value',
            'peter@lustig.de',
          )
          expect(wrapper.find('input[name="lastname"]').element).toHaveProperty('value', 'Lustig')

          expect(wrapper.find('input[name="dataprivacy"]').element).toHaveProperty('checked', true)
        })

        describe('error message for user', () => {
          it('shows error message', () => {
            expect(wrapper.find('span.info-text.form-error').exists()).toBe(true)
            expect(wrapper.find('span.info-text.form-error').text()).toBe(
              "$t('home.newsletterSection.newsletterForm.errorMsg')",
            )
          })

          describe('run timers', () => {
            beforeEach(() => {
              vi.runAllTimers()
            })

            it('does not show the message anymore', () => {
              expect(wrapper.find('span.info-text.form-error').exists()).toBe(false)
            })
          })
        })
      })
    })
  })
})
