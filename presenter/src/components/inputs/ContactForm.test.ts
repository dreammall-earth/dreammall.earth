import { DefaultApolloClient } from '@vue/apollo-composable'
import { mount, flushPromises } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { createContactFormMutation } from '#mutations/createContactForm'

import ContactForm from './ContactForm.vue'

const mockClient = createMockClient()

const createContactFormMutationMock = vi.fn()

mockClient.setRequestHandler(
  createContactFormMutation,
  createContactFormMutationMock.mockResolvedValue({ data: { createContactForm: true } }),
)

describe('ContactForm', () => {
  const Wrapper = () => {
    return mount(ContactForm, {
      global: {
        provide: {
          [DefaultApolloClient]: mockClient,
        },
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders form', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('form validation', () => {
    describe('no valid email', () => {
      beforeEach(async () => {
        await wrapper.find('input[name="firstname"]').setValue('Peter')
        await wrapper.find('input[name="email"]').setValue('peter(at)lustig.de')
        await wrapper.find('input[name="lastname"]').setValue('Lustig')
        await wrapper.find('textarea[name="message"]').setValue('Eine gute Frage.')
        await wrapper.find('input[name="dataprivacy"]').setValue(true)
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
      })

      it('shows error for email', () => {
        expect(wrapper.find('.v-messages__message').text()).toBe(
          'Dieses Feld muss eine Email-Adresse sein.',
        )
      })
    })

    describe('last name too long', () => {
      beforeEach(async () => {
        await wrapper.find('input[name="firstname"]').setValue('Peter')
        await wrapper.find('input[name="email"]').setValue('peter@lustig.de')
        await wrapper
          .find('input[name="lastname"]')
          .setValue(
            'Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
          )
        await wrapper.find('textarea[name="message"]').setValue('Eine gute Frage.')
        await wrapper.find('input[name="dataprivacy"]').setValue(true)
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
      })

      it('shows error for last name', () => {
        expect(wrapper.find('.v-messages__message').text()).toBe('Dieses Feld ist zu lang.')
      })
    })
  })

  describe('submit', () => {
    describe('empty form', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
      })

      it('shows errors for all 5 fields', () => {
        const errorMessages = wrapper.findAll('.v-messages__message')
        expect(errorMessages).toHaveLength(5)
        // firstname
        expect(errorMessages[0].text()).toBe('Dieses Feld wird benötigt.')
        // email
        expect(errorMessages[1].text()).toBe('Dieses Feld wird benötigt.')
        // lastname
        expect(errorMessages[2].text()).toBe('Dieses Feld wird benötigt.')
        // content
        expect(errorMessages[3].text()).toBe('Dieses Feld wird benötigt.')
        // checkbox
        expect(errorMessages[4].text()).toBe("$t('validation.fieldRequired')")
      })

      it('user feedback not visible', () => {
        expect(wrapper.find('span.info-text.form-success').exists()).toBe(false)
        expect(wrapper.find('span.info-text.form-error').exists()).toBe(false)
      })

      it('does not call the API', () => {
        expect(createContactFormMutationMock).not.toBeCalled()
      })
    })

    describe('valid form', () => {
      beforeEach(async () => {
        vi.useFakeTimers()
        await wrapper.find('input[name="firstname"]').setValue('Peter')
        await wrapper.find('input[name="email"]').setValue('peter@lustig.de')
        await wrapper.find('input[name="lastname"]').setValue('Lustig')
        await wrapper.find('textarea[name="message"]').setValue('Eine gute Frage.')
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
          expect(createContactFormMutationMock).toBeCalledWith({
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              content: 'Eine gute Frage.',
            },
          })
        })

        it('resets the form', () => {
          expect(wrapper.find('input[name="firstname"]').element).toHaveProperty('value', '')
          expect(wrapper.find('input[name="email"]').element).toHaveProperty('value', '')
          expect(wrapper.find('input[name="lastname"]').element).toHaveProperty('value', '')
          expect(wrapper.find('textarea[name="message"]').element).toHaveProperty('value', '')
          expect(wrapper.find('input[name="dataprivacy"]').element).toHaveProperty('checked', false)
        })

        describe('success message for user', () => {
          it('shows message', () => {
            expect(wrapper.find('span.info-text.form-success').exists()).toBe(true)
            expect(wrapper.find('span.info-text.form-success').text()).toBe(
              "$t('menu.footer.contactForm.successMsg')",
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
          createContactFormMutationMock.mockRejectedValue({ message: 'Ouch!' })
          await wrapper.find('form').trigger('submit.prevent')
          await flushPromises()
        })

        it('calls the API', () => {
          expect(createContactFormMutationMock).toBeCalledWith({
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              content: 'Eine gute Frage.',
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
          expect(wrapper.find('textarea[name="message"]').element).toHaveProperty(
            'value',
            'Eine gute Frage.',
          )
          expect(wrapper.find('input[name="dataprivacy"]').element).toHaveProperty('checked', true)
        })

        describe('error message for user', () => {
          it('shows error message', () => {
            expect(wrapper.find('span.info-text.form-error').exists()).toBe(true)
            expect(wrapper.find('span.info-text.form-error').text()).toBe(
              "$t('menu.footer.contactForm.errorMsg')",
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
