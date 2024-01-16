import { randomBytes } from 'crypto'

import { TransactionalEmailsApi } from '@getbrevo/brevo'
import { ContactForm, NewsletterPreOptIn } from '@prisma/client'

import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'

import { confirmNewsletter, sendContactEmails, subscribeToNewsletter } from './Brevo'

CONFIG.BREVO_KEY = 'MY KEY'
CONFIG.BREVO_ADMIN_NAME = 'Peter Lustig'
CONFIG.BREVO_ADMIN_EMAIL = 'peter@lustig.de'
CONFIG.BREVO_CONTACT_TEMPLATE_ADMIN = 1
CONFIG.BREVO_CONTACT_TEMPLATE_USER = 2
CONFIG.BREVO_NEWSLETTER_TEMPLATE_OPTIN = 3
CONFIG.BREVO_NEWSLETTER_LIST = 3

const mockSendTransacEmail = jest.fn().mockResolvedValue({
  response: { statusCode: 200 },
})
const mockSetApiKey = jest.fn()

const mockCreateContact = jest.fn().mockResolvedValue({
  response: { statusCode: 200 },
})

const code = '1234567890abcdef'
jest.mock('crypto', () => {
  const originalModule = jest.requireActual<typeof import('crypto')>('crypto')
  return {
    randomBytes: jest
      .fn()
      .mockImplementationOnce(() => Buffer.from(code, 'hex'))
      .mockImplementation((size: number) => originalModule.randomBytes(size)),
  }
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

        afterAll(() => {
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 200,
            },
          })
        })
      })

      describe('with correct data', () => {
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

    describe('with brevo key given', () => {
      // This must be the first test due to randomBytes mock implementation
      describe('with duplicate code generation', () => {
        beforeEach(async () => {
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
          const time = new Date()
          const validTill = new Date(time)
          validTill.setDate(validTill.getDate() + 30)
          await prisma.newsletterPreOptIn.create({
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              code,
              validTill,
              brevoSuccessMail: time,
            },
          })
          jest.clearAllMocks()
          await subscribeToNewsletter(firstName, lastName, email)
        })

        it('calls randomBytes twice', () => {
          expect(randomBytes).toHaveBeenCalledTimes(2)
        })
      })

      describe('with error from Brevo', () => {
        beforeAll(async () => {
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
          jest.clearAllMocks()
          mockSendTransacEmail.mockRejectedValue({
            response: {
              statusCode: 400,
            },
          })
        })

        it('does not reject with error', async () => {
          await expect(subscribeToNewsletter(firstName, lastName, email)).resolves.toStrictEqual(
            true,
          )
        })

        it('creates database entry with brevoSuccessMail = null', async () => {
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

        afterAll(() => {
          jest.clearAllMocks()
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 200,
            },
          })
        })
      })

      describe('with wrong statuscode from Brevo', () => {
        beforeAll(async () => {
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
          jest.clearAllMocks()
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 400,
            },
          })
        })

        it('does not reject with error', async () => {
          await expect(subscribeToNewsletter(firstName, lastName, email)).resolves.toStrictEqual(
            true,
          )
        })

        it('creates database entry with brevoSuccessMail = null', async () => {
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

        afterAll(() => {
          jest.clearAllMocks()
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 200,
            },
          })
        })
      })

      describe('request twice within 10min', () => {
        beforeEach(async () => {
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
          jest.clearAllMocks()
          await subscribeToNewsletter(firstName, lastName, email)
        })

        it('throws error', async () => {
          await expect(subscribeToNewsletter(firstName, lastName, email)).rejects.toThrow(
            'Please try later again',
          )
        })

        it('does not throw on different email', async () => {
          await expect(
            subscribeToNewsletter(firstName, lastName, 'someother@email.de'),
          ).resolves.toBe(true)
        })

        afterAll(() => {
          jest.clearAllMocks()
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 200,
            },
          })
        })
      })

      describe('with correct data', () => {
        beforeEach(async () => {
          jest.clearAllMocks()
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccessMail: expect.any(Date),
              brevoSuccessList: null,
            },
          ])
        })
      })
    })

    describe('without brevo key', () => {
      let result: Awaited<ReturnType<typeof subscribeToNewsletter>>
      beforeEach(async () => {
        jest.clearAllMocks()
        CONFIG.BREVO_KEY = undefined
        result = await subscribeToNewsletter(firstName, lastName, email)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })

      it('does not call sendTransacEmail', () => {
        expect(mockSendTransacEmail).not.toHaveBeenCalled()
      })

      afterAll(() => {
        CONFIG.BREVO_KEY = 'MY KEY'
      })
    })
  })

  describe('confirmNewsletter', () => {
    describe('with brevo key', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
        await prisma.$executeRaw`DELETE FROM NewsletterSubscription`
        const time = new Date()
        const validTill = new Date(time)
        validTill.setDate(validTill.getDate() + 30)
        await prisma.newsletterPreOptIn.create({
          data: {
            firstName: 'Peter',
            lastName: 'Lustig',
            email: 'peter@lustig.de',
            code,
            validTill,
            brevoSuccessMail: time,
          },
        })
      })

      describe('with invalid code', () => {
        it('returns false', async () => {
          await expect(confirmNewsletter('1234567890abcdefG')).resolves.toStrictEqual(false)
        })
      })

      describe('with error from Brevo', () => {
        beforeEach(() => {
          jest.clearAllMocks()
          mockCreateContact.mockRejectedValue({
            response: {
              statusCode: 400,
            },
          })
        })

        it('does not reject with error', async () => {
          await expect(confirmNewsletter(code)).resolves.toStrictEqual(true)
        })

        it('does not update database entry', async () => {
          const result: NewsletterPreOptIn[] = await prisma.newsletterPreOptIn.findMany()
          expect(result).toHaveLength(1)
          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              code: '1234567890abcdef',
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

        afterAll(() => {
          mockCreateContact.mockResolvedValue({
            response: {
              statusCode: 200,
            },
          })
        })
      })

      describe('with wrong statuscode from Brevo', () => {
        beforeEach(() => {
          jest.clearAllMocks()
          mockCreateContact.mockResolvedValue({
            response: {
              statusCode: 400,
            },
          })
        })

        it('does not reject with error', async () => {
          await expect(confirmNewsletter(code)).resolves.toStrictEqual(true)
        })

        it('does not update database entry', async () => {
          const result: NewsletterPreOptIn[] = await prisma.newsletterPreOptIn.findMany()
          expect(result).toHaveLength(1)
          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              code: '1234567890abcdef',
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

        afterAll(() => {
          mockCreateContact.mockResolvedValue({
            response: {
              statusCode: 200,
            },
          })
        })
      })

      describe('with correct data', () => {
        let result: Awaited<ReturnType<typeof confirmNewsletter>>
        beforeEach(async () => {
          jest.clearAllMocks()
          result = await confirmNewsletter(code)
        })

        it('sets the API key', () => {
          expect(mockSetApiKey).toHaveBeenCalledTimes(1)
          expect(mockSetApiKey).toHaveBeenCalledWith(0, 'MY KEY')
        })

        it('calls createContact', () => {
          expect(mockCreateContact).toHaveBeenCalledTimes(1)
          expect(mockCreateContact).toHaveBeenCalledWith({
            email: 'peter@lustig.de',
            listIds: [3],
            attributes: { VORNAME: 'Peter', NACHNAME: 'Lustig' },
            updateEnabled: false,
          })
        })

        it('updates database entries', async () => {
          const countOptIn = await prisma.newsletterPreOptIn.count()
          const resultOptIn = await prisma.$queryRaw`SELECT * FROM NewsletterPreOptIn`
          expect(countOptIn).toBe(0)
          expect(resultOptIn).toHaveLength(1)
          expect(resultOptIn).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              code: '1234567890abcdef',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              validTill: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              deletedAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccessMail: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccessList: expect.any(Date),
            },
          ])

          const countSubscription = await prisma.newsletterSubscription.count()
          const resultSubscription = await prisma.$queryRaw`SELECT * FROM NewsletterSubscription`
          expect(countSubscription).toBe(1)
          expect(resultSubscription).toHaveLength(1)
          expect(resultSubscription).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              deletedAt: null,
            },
          ])
        })

        it('returns true', () => {
          expect(result).toBe(true)
        })
      })

      describe('when resubscribing', () => {
        let result: Awaited<ReturnType<typeof confirmNewsletter>>
        const code2 = 'fedcba0987654321'

        beforeEach(async () => {
          jest.clearAllMocks()
          await confirmNewsletter(code)
          const time = new Date()
          const validTill = new Date(time)
          validTill.setDate(validTill.getDate() + 30)
          await prisma.newsletterPreOptIn.create({
            data: {
              firstName: 'Bibi',
              lastName: 'Bloxberg',
              email: 'peter@lustig.de',
              code: code2,
              validTill,
              brevoSuccessMail: time,
            },
          })
          await prisma.$queryRaw`SELECT * FROM NewsletterPreOptIn`
          result = await confirmNewsletter(code2)
        })

        it('calls createContact', () => {
          expect(mockCreateContact).toHaveBeenCalledTimes(2)
          expect(mockCreateContact).toHaveBeenCalledWith({
            email: 'peter@lustig.de',
            listIds: [3],
            attributes: { VORNAME: 'Peter', NACHNAME: 'Lustig' },
            updateEnabled: false,
          })
          expect(mockCreateContact).toHaveBeenCalledWith({
            email: 'peter@lustig.de',
            listIds: [3],
            attributes: { VORNAME: 'Bibi', NACHNAME: 'Bloxberg' },
            updateEnabled: false,
          })
        })

        it('updates database entries', async () => {
          const countOptIn = await prisma.newsletterPreOptIn.count()
          const resultOptIn = await prisma.$queryRaw`SELECT * FROM NewsletterPreOptIn`
          expect(countOptIn).toBe(0)
          expect(resultOptIn).toHaveLength(2)
          expect(resultOptIn).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              code: '1234567890abcdef',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              validTill: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              deletedAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccessMail: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccessList: expect.any(Date),
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Bibi',
              lastName: 'Bloxberg',
              email: 'peter@lustig.de',
              code: 'fedcba0987654321',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              validTill: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              deletedAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccessMail: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              brevoSuccessList: expect.any(Date),
            },
          ])

          const countSubscription = await prisma.newsletterSubscription.count()
          const resultSubscription = await prisma.$queryRaw`SELECT * FROM NewsletterSubscription`
          expect(countSubscription).toBe(1)
          expect(resultSubscription).toHaveLength(2)
          expect(resultSubscription).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              deletedAt: expect.any(Date),
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              firstName: 'Bibi',
              lastName: 'Bloxberg',
              email: 'peter@lustig.de',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              deletedAt: null,
            },
          ])
        })

        it('returns true', () => {
          expect(result).toBe(true)
        })
      })
    })

    describe('without brevo key', () => {
      let result: Awaited<ReturnType<typeof confirmNewsletter>>
      beforeEach(async () => {
        jest.clearAllMocks()
        CONFIG.BREVO_KEY = undefined
        result = await confirmNewsletter(code)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })

      it('does not call createContact', () => {
        expect(mockCreateContact).not.toHaveBeenCalled()
      })
    })
  })
})
