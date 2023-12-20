import { ContactsApi, CreateContact, TransactionalEmailsApi } from '@getbrevo/brevo'
import { ContactForm, NewsletterSubscription } from '@prisma/client'

import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'

import {
  sendContactFormEmail,
  createAddContactToList,
  createBrevoContactsApi,
  sendContactToBrevo,
} from './NewsletterBrevo'

CONFIG.BREVO_KEY = 'MY KEY'
CONFIG.BREVO_CONTACT_REQUEST_TO_NAME = 'Peter Lustig'
CONFIG.BREVO_CONTACT_REQUEST_TO_EMAIL = 'peter@lustig.de'
CONFIG.BREVO_TEMPLATE_CONTACT_BASE = 1
CONFIG.BREVO_TEMPLATE_CONTACT_USER = 2
CONFIG.BREVO_CONTACT_LIST_ID = 3

const mockSendTransacEmail = jest.fn().mockResolvedValue({
  response: 'success',
})
const mockSetApiKey = jest.fn()

const mockCreateContact = jest.fn().mockResolvedValue({
  response: 'success',
})

jest.mock('@getbrevo/brevo', () => {
  const originalModule = jest.requireActual<typeof import('@getbrevo/brevo')>('@getbrevo/brevo')
  return {
    __esModule: true,
    ...originalModule,
    TransactionalEmailsApi: jest.fn().mockImplementation(() => {
      return {
        setApiKey: mockSetApiKey,
        sendTransacEmail: mockSendTransacEmail,
      }
    }),
    ContactsApi: jest.fn().mockImplementation(() => {
      return {
        setApiKey: jest.fn(),
        createContact: mockCreateContact,
      }
    }),
    SendSmtpEmail: jest.fn().mockImplementation(() => {
      return {}
    }),
  }
})

let contactForm: ContactForm
beforeEach(async () => {
  await prisma.contactForm.deleteMany()
  contactForm = await prisma.contactForm.create({
    data: {
      firstName: 'Bibi',
      lastName: 'Bloxberg',
      content: 'Hello DreamMall!',
      email: 'bibi@bloxberg.de',
    },
  })
})

describe('NewsletterBrevo', () => {
  describe('sendContactFormEmail', () => {
    describe('brevo key given', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        await sendContactFormEmail(contactForm)
      })

      it('calls TransactionalEmailsApi constructor', () => {
        expect(TransactionalEmailsApi).toHaveBeenCalledTimes(1)
      })

      it('sets the API key', () => {
        expect(mockSetApiKey).toHaveBeenCalledTimes(1)
        expect(mockSetApiKey).toHaveBeenCalledWith(0, 'MY KEY')
      })

      it('calls TransactionalEmailsApi constructor', () => {
        expect(TransactionalEmailsApi).toHaveBeenCalledTimes(1)
      })

      it('calls sendSmtpEmail twice', () => {
        expect(mockSendTransacEmail).toHaveBeenCalledTimes(2)
      })

      it('sends email to base', () => {
        expect(mockSendTransacEmail).toHaveBeenCalledWith({
          templateId: 1,
          to: [
            {
              name: 'Peter Lustig',
              email: 'peter@lustig.de',
            },
          ],
          sender: {
            name: 'Bibi Bloxberg',
            email: 'bibi@bloxberg.de',
          },
          replyTo: {
            name: 'Bibi Bloxberg',
            email: 'bibi@bloxberg.de',
          },
          params: {
            firstName: contactForm.firstName,
            lastName: contactForm.lastName,
            content: contactForm.content,
            email: contactForm.email,
          },
        })
      })

      describe('with success', () => {
        beforeEach(() => {
          jest.clearAllMocks()
        })
        it('does update the database', async () => {
          const result: ContactForm[] = await prisma.contactForm.findMany()
          expect(result).toHaveLength(1)
          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Bibi',
              lastName: 'Bloxberg',
              content: 'Hello DreamMall!',
              email: 'bibi@bloxberg.de',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccess: expect.any(Date),
            },
          ])
        })
      })

      describe('with error', () => {
        beforeEach(async () => {
          jest.clearAllMocks()
          mockSendTransacEmail.mockRejectedValue({
            error: 'error',
          })
          await prisma.contactForm.deleteMany()
          contactForm = await prisma.contactForm.create({
            data: {
              firstName: 'Bibi',
              lastName: 'Bloxberg',
              content: 'Hello DreamMall!',
              email: 'bibi@bloxberg.de',
            },
          })
        })

        it('does not update the database', async () => {
          const result: ContactForm[] = await prisma.contactForm.findMany()
          expect(result).toHaveLength(1)
          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Bibi',
              lastName: 'Bloxberg',
              content: 'Hello DreamMall!',
              email: 'bibi@bloxberg.de',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              brevoSuccess: null,
            },
          ])
        })
      })
    })

    describe('without brevo key', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        CONFIG.BREVO_KEY = undefined
        await sendContactFormEmail(contactForm)
      })

      it('does not call sendSmtpEmail', () => {
        expect(mockSendTransacEmail).not.toHaveBeenCalled()
      })

      afterAll(() => {
        CONFIG.BREVO_KEY = 'MY KEY'
      })
    })
  })

  describe('newsletter', () => {
    let newsletterSubscription: NewsletterSubscription
    beforeEach(async () => {
      await prisma.newsletterSubscription.deleteMany()
      newsletterSubscription = await prisma.newsletterSubscription.create({
        data: {
          firstName: 'Bibi',
          lastName: 'Bloxberg',
          email: 'bibi@bloxberg.de',
        },
      })
    })

    describe('createBrevoContactsApi', () => {
      let result: ContactsApi

      beforeEach(() => {
        jest.clearAllMocks()
        result = createBrevoContactsApi()
      })

      it('calls ContactsApi constructor', () => {
        expect(ContactsApi).toHaveBeenCalledTimes(1)
      })

      it('sets the API key', () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(result.setApiKey).toHaveBeenCalledTimes(1)
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(result.setApiKey).toHaveBeenCalledWith(0, 'MY KEY')
      })
    })

    describe('createAddContactToList', () => {
      let result: CreateContact

      beforeEach(() => {
        jest.clearAllMocks()
        result = createAddContactToList(newsletterSubscription)
      })

      it('returns sendSmtpEmail object', () => {
        expect(result).toEqual({
          email: newsletterSubscription.email,
          listIds: [3],
          attributes: {
            VORNAME: newsletterSubscription.firstName,
            NACHNAME: newsletterSubscription.lastName,
          },
          updateEnabled: false,
        })
      })
    })

    describe('sendContactToBrevo', () => {
      describe('brevo key given', () => {
        beforeEach(async () => {
          jest.clearAllMocks()
          await sendContactToBrevo(newsletterSubscription)
        })

        it('calls createContact', () => {
          expect(mockCreateContact).toHaveBeenCalledWith({
            email: newsletterSubscription.email,
            listIds: [3],
            attributes: {
              VORNAME: newsletterSubscription.firstName,
              NACHNAME: newsletterSubscription.lastName,
            },
            updateEnabled: false,
          })
        })

        it('does update the database', async () => {
          const result: NewsletterSubscription[] = await prisma.newsletterSubscription.findMany()
          expect(result).toHaveLength(1)
          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Bibi',
              lastName: 'Bloxberg',
              email: 'bibi@bloxberg.de',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccess: expect.any(Date),
            },
          ])
        })
      })

      describe('with error from Brevo', () => {
        beforeEach(() => {
          jest.clearAllMocks()
          mockCreateContact.mockRejectedValue({
            error: 'error',
          })
        })

        it('expect to reject with error', async () => {
          await expect(sendContactToBrevo(newsletterSubscription)).rejects.toStrictEqual({
            error: 'error',
          })
        })

        it('does not update the database', async () => {
          const result: NewsletterSubscription[] = await prisma.newsletterSubscription.findMany()
          expect(result).toHaveLength(1)
          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Bibi',
              lastName: 'Bloxberg',
              email: 'bibi@bloxberg.de',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              brevoSuccess: null,
            },
          ])
        })
      })

      describe('without brevo key', () => {
        beforeEach(async () => {
          jest.clearAllMocks()
          CONFIG.BREVO_KEY = undefined
          await sendContactToBrevo(newsletterSubscription)
        })

        it('does not call sendSmtpEmail', () => {
          expect(mockCreateContact).not.toHaveBeenCalled()
        })
      })
    })
  })
})
