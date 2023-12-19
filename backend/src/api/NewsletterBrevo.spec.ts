// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'

import BrevoApi, {
  createBrevoInstance,
  createSmtpEmail,
  sendContactFormEmail,
  sendSmtpEmail,
} from './NewsletterBrevo'

// const mockedSibApiV3SdkTransactionalEmailsApi = <jest.Mock<typeof SibApiV3Sdk.TransactionalEmailsApi>>SibApiV3Sdk.TransactionalEmailsApi

jest.mock('#config/config', () => {
  return {
    BREVO_KEY: 'MY KEY',
    BREVO_CONTACT_REQUEST_TO_NAME: 'Peter Lustig',
    BREVO_CONTACT_REQUEST_TO_EMAIL: 'peter@lustig.de',
    BREVO_TEMPLATE_CONTACT_BASE: '1',
    BREVO_TEMPLATE_CONTACT_USER: '2',
  }
})
const mockSendTransacEmail = jest
.fn()
.mockResolvedValueOnce({
  response: 'success',
})
.mockRejectedValue({
  error: 'error',
})

jest.mock('@getbrevo/brevo', () => {
  const originalModule = jest.requireActual<typeof import('@getbrevo/brevo')>('@getbrevo/brevo')
  return {
    __esModule: true,
    ...originalModule,
    TransactionalEmailsApi: jest.fn().mockImplementation(() => {
      return {
        setApiKey: jest.fn(),
        sendTransacEmail: mockSendTransacEmail
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
  describe('createBrevoInstance', () => {
    let result: SibApiV3Sdk.TransactionalEmailsApi

    beforeEach(() => {
      jest.clearAllMocks()
      result = createBrevoInstance()
    })

    it('calls TransactionalEmailsApi constructor', () => {
      expect(SibApiV3Sdk.TransactionalEmailsApi).toBeCalledTimes(1)
    })

    it('sets the API key', () => {
      expect(result.setApiKey).toBeCalledTimes(1)
      expect(result.setApiKey).toBeCalledWith(1, 'MY KEY')
    })
  })

  describe('createSmtpEmail', () => {
    let result: SibApiV3Sdk.SendSmtpEmail

    beforeEach(() => {
      jest.clearAllMocks()
      result = createSmtpEmail(
        42,
        [
          {
            name: 'Peter Lustig',
            email: 'peter@lustig.de',
          },
        ],
        {
          name: 'Bibi Bloxberg',
          email: 'bibi@bloxberg.de',
        },
        {
          name: 'Bibi Bloxberg',
          email: 'bibi@bloxberg.de',
        },
        {
          ...contactForm,
        },
      )
    })

    it('returns sendSmtpEmail object', () => {
      expect(result).toEqual({
        templateId: 42,
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
          ...contactForm,
        },
      })
    })
  })

  describe('sendSmtpEmail', () => {
    describe('with error', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        await sendSmtpEmail(
          createSmtpEmail(
            42,
            [
              {
                name: 'Peter Lustig',
                email: 'peter@lustig.de',
              },
            ],
            {
              name: 'Bibi Bloxberg',
              email: 'bibi@bloxberg.de',
            },
            {
              name: 'Bibi Bloxberg',
              email: 'bibi@bloxberg.de',
            },
            {
              ...contactForm,
            },
          ),
          contactForm,
        )
      })

      it.skip('does not update the database', async () => {
        const result: ContactForm[] = await prisma.contactForm.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            id: expect.any(Number),
            firstName: 'Bibi',
            lastName: 'Bloxberg',
            content: 'Hello DreamMall!',
            email: 'bibi@bloxberg.de',
            createdAt: expect.any(Date),
            brevoSuccess: null,
          },
        ])
      })
    })

    describe('with success', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        await sendSmtpEmail(
          createSmtpEmail(
            42,
            [
              {
                name: 'Peter Lustig',
                email: 'peter@lustig.de',
              },
            ],
            {
              name: 'Bibi Bloxberg',
              email: 'bibi@bloxberg.de',
            },
            {
              name: 'Bibi Bloxberg',
              email: 'bibi@bloxberg.de',
            },
            {
              ...contactForm,
            },
          ),
          contactForm,
        )
      })

      it('calls TransactionalEmailsApi constructor', () => {
        expect(SibApiV3Sdk.TransactionalEmailsApi).toBeCalledTimes(1)
      })

      it('updates the database', async () => {
        const result: ContactForm[] = await prisma.contactForm.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            id: expect.any(Number),
            firstName: 'Bibi',
            lastName: 'Bloxberg',
            content: 'Hello DreamMall!',
            email: 'bibi@bloxberg.de',
            createdAt: expect.any(Date),
            brevoSucmockmyfunccess: expect.any(Date),
          },
        ])
      })
    })
  })

  describe.only('sendContactFormEmail', () => {
    describe('brevo key given', () => {
      beforeEach(async () => {
        jest.clearAllMocks()
        await sendContactFormEmail(contactForm)
      })

      it('calls sendSmtpEmail twice', () => {
        expect(mockSendTransacEmail).toHaveBeenCalledTimes(2)
      })
    })
  })
})
