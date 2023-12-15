// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'

import { sendContactFormEmail } from './NewsletterBrevo'

jest.mock('#config/config', () => {
  return {
    // TODO: To tests the NewsletterBrevo we need a value and mock setApiKey correctly
    BREVO_KEY: '',
    BREVO_CONTACT_REQUEST_TO_NAME: 'Peter Lustig',
    BREVO_CONTACT_REQUEST_TO_EMAIL: 'peter@lustig.de',
    BREVO_TEMPLATE_CONTACT_BASE: '1',
    BREVO_TEMPLATE_CONTACT_USER: '2',
  }
})

jest.mock('@getbrevo/brevo', () => {
  return {
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
    beforeEach(() => {
      jest.resetAllMocks()
      // TODO: This does lead to the Brevo API been called
      config.BREVO_KEY = '1234'
      sendContactFormEmail(contactForm)
    })

    // TODO: Make Brevo API been called and remove skip
    it.skip('does call mocked Brevo library', () => {
      expect(SibApiV3Sdk.TransactionalEmailsApi).toHaveBeenCalledTimes(1)
    })
  })
})
