import { TransactionalEmailsApi } from '@getbrevo/brevo'
import { ContactForm, NewsletterPreOptIn } from '@prisma/client'

import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'

import { sendContactEmails, subscribeToNewsletter } from './Brevo'

CONFIG.BREVO_KEY = 'MY KEY'
CONFIG.BREVO_ADMIN_NAME = 'Peter Lustig'
CONFIG.BREVO_ADMIN_EMAIL = 'peter@lustig.de'
CONFIG.BREVO_CONTACT_TEMPLATE_ADMIN = 1
CONFIG.BREVO_CONTACT_TEMPLATE_USER = 2
CONFIG.BREVO_NEWSLETTER_TEMPLATE_OPTIN = 3
CONFIG.BREVO_NEWSLETTER_LIST = 3

const mockSendTransacEmail = jest.fn().mockResolvedValue({
  response: {
    statusCode: 200,
  },
})
const mockSetApiKey = jest.fn()

/* const mockCreateContact = jest.fn().mockResolvedValue({
  response: 'success',
})
*/

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
    /* ContactsApi: jest.fn().mockImplementation(() => {
      return {
        setApiKey: mockSetApiKey,
        createContact: mockCreateContact,
      }
    }), */
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

    describe('with error from Brevo', () => {
      beforeEach(() => {
        jest.clearAllMocks()
        mockSendTransacEmail
          .mockResolvedValueOnce({
            response: {
              statusCode: 200,
            },
          })
          .mockRejectedValue({
            response: {
              statusCode: 400,
            },
          })
      })

      it('does reject with error', async () => {
        await expect(sendContactEmails(contactForm)).rejects.toStrictEqual({
          response: {
            statusCode: 400,
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
    const firstName = 'Bibi'
    const lastName = 'Bloxberg'
    const email = 'bibi@bloxberg.de'

    describe('brevo key given', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        await prisma.newsletterPreOptIn.deleteMany({})
        await subscribeToNewsletter(firstName, lastName, email)
      })

      it('sets the API key', () => {
        expect(mockSetApiKey).toHaveBeenCalledTimes(1)
        expect(mockSetApiKey).toHaveBeenCalledWith(0, 'MY KEY')
      })

      it('creates database entry', async () => {
        const result: NewsletterPreOptIn[] = await prisma.newsletterPreOptIn.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            firstName: 'Bibi',
            lastName: 'Bloxberg',
            email: 'bibi@bloxberg.de',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            code: expect.any(String),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            validTill: expect.any(Date),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
            deletedAt: null,
            brevoSuccessMail: null,
            brevoSuccessList: null,
          },
        ])
      })

      it.skip('updates database entry', async () => {
        const result: NewsletterPreOptIn[] = await prisma.newsletterPreOptIn.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            firstName: 'Bibi',
            lastName: 'Bloxberg',
            email: 'bibi@bloxberg.de',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            code: expect.any(String),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            validTill: expect.any(Date),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
            deletedAt: null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            brevoSuccessMail: expect.any(Date),
            brevoSuccessList: null,
          },
        ])
      })
    })

    describe('with error from Brevo', () => {
      beforeAll(async () => {
        await prisma.newsletterPreOptIn.deleteMany({})
      })

      beforeEach(() => {
        jest.clearAllMocks()
        mockSendTransacEmail.mockRejectedValue({
          response: {
            statusCode: 400,
          },
        })
      })

      it('does not reject with error', async () => {
        await expect(subscribeToNewsletter(firstName, lastName, email)).resolves.toStrictEqual(true)
      })

      it('creates database entry', async () => {
        const result: NewsletterPreOptIn[] = await prisma.newsletterPreOptIn.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            firstName: 'Bibi',
            lastName: 'Bloxberg',
            email: 'bibi@bloxberg.de',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            code: expect.any(String),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            validTill: expect.any(Date),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
            deletedAt: null,
            brevoSuccessMail: null,
            brevoSuccessList: null,
          },
        ])
      })

      it.skip('does not update the database', async () => {
        const result: NewsletterPreOptIn[] = await prisma.newsletterPreOptIn.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            firstName: 'Bibi',
            lastName: 'Bloxberg',
            email: 'bibi@bloxberg.de',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            code: expect.any(String),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            validTill: expect.any(Date),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
            deletedAt: null,
            brevoSuccessMail: null,
            brevoSuccessList: null,
          },
        ])
      })
    })

    describe('without brevo key', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        CONFIG.BREVO_KEY = undefined
        await subscribeToNewsletter(firstName, lastName, email)
      })

      it('does not call sendTransacEmail', () => {
        expect(mockSendTransacEmail).not.toHaveBeenCalled()
      })
    })
  })
})
