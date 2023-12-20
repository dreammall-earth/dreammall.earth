import { ContactsApi, TransactionalEmailsApi } from '@getbrevo/brevo'
import { ContactForm, NewsletterSubscription } from '@prisma/client'

import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'

import { sendContactEmails, subscribeToNewsletter } from './Brevo'

CONFIG.BREVO_KEY = 'MY KEY'
CONFIG.BREVO_ADMIN_NAME = 'Peter Lustig'
CONFIG.BREVO_ADMIN_EMAIL = 'peter@lustig.de'
CONFIG.BREVO_CONTACT_TEMPLATE_ADMIN = 1
CONFIG.BREVO_CONTACT_TEMPLATE_USER = 2
CONFIG.BREVO_NEWSLETTER_LIST = 3

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
        setApiKey: mockSetApiKey,
        createContact: mockCreateContact,
      }
    }),
    SendSmtpEmail: jest.fn().mockImplementation(() => {
      return {}
    }),
  }
})

describe('Brevo', () => {
  describe('sendContactEmails', () => {
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

    describe('brevo key given', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        await sendContactEmails(contactForm)
      })

      it('calls TransactionalEmailsApi constructor', () => {
        expect(TransactionalEmailsApi).toHaveBeenCalledTimes(1)
      })

      it('sets the API key', () => {
        expect(mockSetApiKey).toHaveBeenCalledTimes(1)
        expect(mockSetApiKey).toHaveBeenCalledWith(0, 'MY KEY')
      })

      it('calls sendSmtpEmail twice', () => {
        expect(mockSendTransacEmail).toHaveBeenCalledTimes(2)
      })

      it('sends email to admin', () => {
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
          params: contactForm,
        })
      })

      it('sends email to user', () => {
        expect(mockSendTransacEmail).toHaveBeenCalledWith({
          templateId: 2,
          to: [
            {
              name: 'Bibi Bloxberg',
              email: 'bibi@bloxberg.de',
            },
          ],
          sender: {
            name: 'Peter Lustig',
            email: 'peter@lustig.de',
          },
          replyTo: {
            name: 'Peter Lustig',
            email: 'peter@lustig.de',
          },
          params: contactForm,
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
        await sendContactEmails(contactForm)
      })

      it('does not call sendSmtpEmail', () => {
        expect(mockSendTransacEmail).not.toHaveBeenCalled()
      })

      afterAll(() => {
        CONFIG.BREVO_KEY = 'MY KEY'
      })
    })
  })

  describe('subscribeToNewsletter', () => {
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
    describe('brevo key given', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        await subscribeToNewsletter(newsletterSubscription)
      })

      it('calls ContactsApi constructor', () => {
        expect(ContactsApi).toHaveBeenCalledTimes(1)
      })

      it('sets the API key', () => {
        expect(mockSetApiKey).toHaveBeenCalledTimes(1)
        expect(mockSetApiKey).toHaveBeenCalledWith(0, 'MY KEY')
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
        await expect(subscribeToNewsletter(newsletterSubscription)).rejects.toStrictEqual({
          error: 'error',
        })
      })

      it('does not update the database', async () => {
        const result: NewsletterSubscription[] = await prisma.newsletterSubscription.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            // eslint-disable-next-line @typescript-e
})lint/no-unsafe-assignment
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
        await subscribeToNewsletter(newsletterSubscription)
      })

      it('does not call sendSmtpEmail', () => {
        expect(mockCreateContact).not.toHaveBeenCalled()
      })
    })
  })
})
