import { randomBytes } from 'crypto'

import { TransactionalEmailsApi } from '@getbrevo/brevo'

import { prisma } from '#src/prisma'
import { mockContextValue } from '#test/mockContextValue'
import { createMockLogger } from '#test/mockLogger'

import { createBrevoClient } from './Brevo'

import type { Logger } from '#src/logger'

const { config: baseConfig, sentry } = mockContextValue()

const config = {
  ...baseConfig,
  BREVO_KEY: 'MY KEY',
  BREVO_ADMIN_NAME: 'Peter Lustig',
  BREVO_ADMIN_EMAIL: 'peter@lustig.de',
  BREVO_CONTACT_TEMPLATE_ADMIN: 1,
  BREVO_CONTACT_TEMPLATE_USER: 2,
  BREVO_NEWSLETTER_TEMPLATE_OPTIN: 3,
  BREVO_NEWSLETTER_LIST: 3,
}

const logger = jest.mocked<Logger>(createMockLogger() as unknown as Logger)

const { confirmNewsletter, sendContactEmails, subscribeToNewsletter } = createBrevoClient({
  sentry,
  config,
  prisma,
  logger,
})

const mockSendTransacEmail = jest.fn().mockResolvedValue({
  response: { statusCode: 201 },
})
const mockSetApiKey = jest.fn()

const mockCreateContact = jest.fn().mockResolvedValue({
  response: { statusCode: 201 },
})

const code = '1234567890abcdef'

// eslint-disable-next-line jest/no-untyped-mock-factory
jest.mock('crypto', () => {
  const originalModule = jest.requireActual<typeof import('crypto')>('crypto')
  return {
    randomBytes: jest
      .fn()
      .mockImplementationOnce(() => Buffer.from(code, 'hex'))
      .mockImplementation((size: number) => originalModule.randomBytes(size)),
  }
})

// eslint-disable-next-line jest/no-untyped-mock-factory
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
  beforeEach(jest.clearAllMocks)

  describe('sendContactEmails', () => {
    const contactFormData = {
      firstName: 'Bibi',
      lastName: 'Bloxberg',
      content: 'Hello DreamMall!',
      email: 'bibi@bloxberg.de',
    }
    beforeEach(async () => {
      await prisma.contactForm.deleteMany()
    })

    describe('brevo key given', () => {
      describe('with error from Brevo', () => {
        beforeEach(() => {
          mockSendTransacEmail
            .mockResolvedValueOnce({
              response: {
                statusCode: 201,
              },
            })
            .mockRejectedValue({
              response: {
                statusCode: 400,
              },
            })
        })

        it('does reject with error', async () => {
          await expect(sendContactEmails(contactFormData)).rejects.toStrictEqual({
            response: {
              statusCode: 400,
            },
          })
        })

        it('has the contact form stored in the database without brevo success date', async () => {
          await expect(sendContactEmails(contactFormData)).rejects.toBeTruthy()
          const result = await prisma.contactForm.findMany()
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

      describe('with correct data', () => {
        beforeEach(async () => {
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 201,
            },
          })
          await sendContactEmails(contactFormData)
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

        it('sends email to admin', async () => {
          const contactForm = await prisma.contactForm.findFirst()
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

        it('sends email to user', async () => {
          const contactForm = await prisma.contactForm.findFirst()
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

        it('has the contact form stored in the database with brevo success date', async () => {
          const result = await prisma.contactForm.findMany()
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
      it('does not call sendSmtpEmail', async () => {
        const brevo = createBrevoClient({
          sentry,
          prisma,
          logger,
          config: { ...config, BREVO_KEY: undefined },
        })
        await brevo.sendContactEmails(contactFormData)
        expect(mockSendTransacEmail).not.toHaveBeenCalled()
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
          await subscribeToNewsletter(firstName, lastName, email)
        })

        it('calls randomBytes twice', () => {
          expect(randomBytes).toHaveBeenCalledTimes(2)
        })
      })

      describe('with error from Brevo', () => {
        beforeEach(async () => {
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
          mockSendTransacEmail.mockRejectedValue({
            response: {
              statusCode: 400,
            },
          })
        })

        it('does not reject with error', async () => {
          await expect(subscribeToNewsletter(firstName, lastName, email)).resolves.toBe(true)
        })

        it('sends the API response to Sentry nevertheless', async () => {
          await subscribeToNewsletter(firstName, lastName, email)
          expect(sentry.captureException).toHaveBeenCalledWith({
            response: {
              statusCode: 400,
            },
          })
        })

        it('creates database entry with brevoSuccessMail = null', async () => {
          await subscribeToNewsletter(firstName, lastName, email)
          const result = await prisma.newsletterPreOptIn.findMany()
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

      describe('with unexpected statuscode from Brevo', () => {
        beforeEach(async () => {
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 400,
            },
          })
        })

        it('does not reject with error', async () => {
          await expect(subscribeToNewsletter(firstName, lastName, email)).resolves.toBe(true)
        })

        it('captures an error with the unexpected API response and sends it to Sentry', async () => {
          await subscribeToNewsletter(firstName, lastName, email)
          expect(sentry.captureException).toHaveBeenCalledWith(
            new Error('Unexpected status code from Brevo API:'),
          )
          const mockedCaptureException = jest.mocked(sentry.captureException)
          const capturedError = mockedCaptureException.mock.calls[0][0] as Error
          expect(capturedError.cause).toEqual({
            response: { statusCode: 400 },
          })
        })

        it('creates database entry with brevoSuccessMail = null', async () => {
          await subscribeToNewsletter(firstName, lastName, email)
          const result = await prisma.newsletterPreOptIn.findMany()
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

      describe('request twice within 10min', () => {
        beforeEach(async () => {
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 201,
            },
          })
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
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
      })

      describe('with correct data', () => {
        beforeEach(async () => {
          mockSendTransacEmail.mockResolvedValue({
            response: {
              statusCode: 201,
            },
          })
          await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
          await subscribeToNewsletter(firstName, lastName, email)
        })

        it('sets the API key', () => {
          expect(mockSetApiKey).toHaveBeenCalledTimes(1)
          expect(mockSetApiKey).toHaveBeenCalledWith(0, 'MY KEY')
        })

        it('creates database entry', async () => {
          const result = await prisma.newsletterPreOptIn.findMany()
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
        const brevo = createBrevoClient({
          sentry,
          prisma,
          logger,
          config: { ...config, BREVO_KEY: undefined },
        })
        result = await brevo.subscribeToNewsletter(firstName, lastName, email)
      })

      it('returns false', () => {
        expect(result).toBe(false)
      })

      it('does not call sendTransacEmail', () => {
        expect(mockSendTransacEmail).not.toHaveBeenCalled()
      })
    })
  })

  describe('confirmNewsletter', () => {
    const setup = async () => {
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
    }

    describe('with brevo key', () => {
      beforeEach(setup)

      describe('with invalid code', () => {
        it('returns false', async () => {
          await expect(confirmNewsletter('1234567890abcdefG')).resolves.toBe(false)
        })
      })

      describe('with error from Brevo', () => {
        beforeEach(() => {
          mockCreateContact.mockRejectedValue({
            response: {
              statusCode: 400,
            },
          })
        })

        it('does not reject with error', async () => {
          await expect(confirmNewsletter(code)).resolves.toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            firstName: 'Peter',
            lastName: 'Lustig',
            email: 'peter@lustig.de',
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
          })
        })

        it('does not update database entry', async () => {
          await confirmNewsletter(code)
          const result = await prisma.newsletterPreOptIn.findMany()
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
      })

      describe('with wrong statuscode from Brevo', () => {
        beforeEach(() => {
          mockCreateContact.mockResolvedValue({
            response: {
              statusCode: 400,
            },
          })
        })

        it('does not reject with error', async () => {
          await expect(confirmNewsletter(code)).resolves.toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            firstName: 'Peter',
            lastName: 'Lustig',
            email: 'peter@lustig.de',
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
          })
        })

        it('captures an error with the unexpected API response and sends it to Sentry', async () => {
          await confirmNewsletter(code)
          expect(sentry.captureException).toHaveBeenCalledWith(
            new Error('Unexpected status code from Brevo API:'),
          )
          const mockedCaptureException = jest.mocked(sentry.captureException)
          const capturedError = mockedCaptureException.mock.calls[0][0] as Error
          expect(capturedError.cause).toEqual({
            response: { statusCode: 400 },
          })
        })

        it('does not update database entry', async () => {
          await confirmNewsletter(code)
          const result = await prisma.newsletterPreOptIn.findMany()
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
      })

      describe('with correct data', () => {
        beforeEach(() => {
          mockCreateContact.mockResolvedValue({
            response: {
              statusCode: 201,
            },
          })
        })

        it('sets the API key', async () => {
          await confirmNewsletter(code)
          expect(mockSetApiKey).toHaveBeenCalledTimes(1)
          expect(mockSetApiKey).toHaveBeenCalledWith(0, 'MY KEY')
        })

        it('calls createContact', async () => {
          await confirmNewsletter(code)
          expect(mockCreateContact).toHaveBeenCalledTimes(1)
          expect(mockCreateContact).toHaveBeenCalledWith({
            email: 'peter@lustig.de',
            listIds: [3],
            attributes: { VORNAME: 'Peter', NACHNAME: 'Lustig' },
            updateEnabled: false,
          })
        })

        it('updates database entries', async () => {
          await confirmNewsletter(code)
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

        it('returns database entry', async () => {
          await expect(confirmNewsletter(code)).resolves.toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            firstName: 'Peter',
            lastName: 'Lustig',
            email: 'peter@lustig.de',
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
          })
        })
      })

      describe('when resubscribing', () => {
        const resubscribe = async () => {
          await confirmNewsletter(code)
          const code2 = 'fedcba0987654321'
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
          return confirmNewsletter(code2)
        }

        it('calls createContact', async () => {
          await resubscribe()
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
          await resubscribe()
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

        it('returns database entry', async () => {
          const result = await resubscribe()
          expect(result).toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            firstName: 'Bibi',
            lastName: 'Bloxberg',
            email: 'peter@lustig.de',
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
          })
        })
      })
    })

    describe('without brevo key', () => {
      const brevo = createBrevoClient({
        sentry,
        prisma,
        logger,
        config: { ...config, BREVO_KEY: undefined },
      })

      it('returns false', async () => {
        await expect(brevo.confirmNewsletter(code)).resolves.toBe(false)
      })

      it('does not call createContact', async () => {
        await brevo.confirmNewsletter(code)
        expect(mockCreateContact).not.toHaveBeenCalled()
      })
    })
  })
})
