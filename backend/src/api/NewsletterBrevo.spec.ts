// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import { prisma } from '#src/prisma'

import { sendContactFormEmail } from './NewsletterBrevo'

jest.mock('#config/config', () => {
  return {
    BREVO_KEY: '',
    BREVO_CONTACT_REQUEST_TO_NAME: 'Peter Lustig',
    BREVO_CONTACT_REQUEST_TO_EMAIL: 'peter@lustig.de',
    BREVO_TEMPLATE_CONTACT_BASE: '1',
    BREVO_TEMPLATE_CONTACT_USER: '2',
  }
})

jest.mock('@getbrevo/brevo', () => {
  // const originalModule = jest.requireActual<typeof import('@getbrevo/brevo')>('@getbrevo/brevo')
  return {
    // __esModule: true,
    // ...originalModule,
    TransactionalEmailsApi: jest.fn().mockResolvedValue(() => {
      return {
        setApiKey: jest.fn(),
        sendTransacEmail: jest.fn(),
      }
    }),
    SendSmtpEmail: jest.fn().mockImplementation(() => {
      return {}
    }),
    TransactionalEmailsApiApiKeys: jest.fn().mockImplementation(() => {
      return {
        apiKey: 1,
      }
    }),
  }
})

let contactForm: ContactForm
beforeAll(async () => {
  contactForm = await prisma.contactForm.create({
    data: {
      firstName: 'Peter',
      lastName: 'Lustig',
      content: 'Hello DreamMall!',
      email: 'peter@lustig.de',
    },
  })
})

describe('NewsletterBrevo', () => {
  describe('call skiped since no BREVO_KEY defined', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      sendContactFormEmail(contactForm)
    })

    it('does not call mocked Brevo library', () => {
      expect(SibApiV3Sdk.TransactionalEmailsApi).not.toHaveBeenCalled()
    })
  })

  describe('call successful', () => {
    jest.mock('#config/config', () => {
      return {
        BREVO_KEY: '1234',
        BREVO_CONTACT_REQUEST_TO_NAME: 'Peter Lustig',
        BREVO_CONTACT_REQUEST_TO_EMAIL: 'peter@lustig.de',
        BREVO_TEMPLATE_CONTACT_BASE: '1',
        BREVO_TEMPLATE_CONTACT_USER: '2',
      }
    })

    beforeEach(() => {
      jest.resetAllMocks()
      sendContactFormEmail(contactForm)
    })

    it.skip('does call mocked Brevo library', () => {
      expect(SibApiV3Sdk.TransactionalEmailsApi).toHaveBeenCalledTimes(1)
    })
  })
})
