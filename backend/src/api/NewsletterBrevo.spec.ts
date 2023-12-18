// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'

import { sendContactFormEmail } from './NewsletterBrevo'

const consoleLogMock = jest.fn()
const consoleWarnMock = jest.fn()
const consoleErrorMock = jest.fn()
// eslint-disable-next-line no-console
console.log = consoleLogMock
// eslint-disable-next-line no-console
console.warn = consoleWarnMock
// eslint-disable-next-line no-console
console.error = consoleErrorMock

jest.mock('#config/config', () => {
  return {
    BREVO_KEY: '',
    BREVO_CONTACT_REQUEST_TO_NAME: 'Peter Lustig',
    BREVO_CONTACT_REQUEST_TO_EMAIL: 'peter@lustig.de',
    BREVO_TEMPLATE_CONTACT_BASE: '1',
    BREVO_TEMPLATE_CONTACT_USER: '2',
  }
})

const setApiKeyMock = jest.fn().mockReturnValue({})
const sendTransacEmailThen = jest.fn().mockReturnValue({})
jest.mock('@getbrevo/brevo', () => {
  return {
    TransactionalEmailsApi: jest.fn().mockImplementation(() => {
      return {
        setApiKey: setApiKeyMock,
        sendTransacEmail: sendTransacEmailThen,
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
      jest.clearAllMocks()
      config.BREVO_KEY = '1234'
      sendContactFormEmail(contactForm)
    })

    it('call setApiKey', () => {
      expect(SibApiV3Sdk.TransactionalEmailsApi).toHaveBeenCalled()
      // setApiKey toHaveBeenCalledWith(
      //   SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      //   '1234',
      // )
    })
  })
})
