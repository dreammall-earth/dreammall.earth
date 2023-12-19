// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'
import { Return } from '@prisma/client/runtime/library'

export const createBrevoInstance = (): SibApiV3Sdk.TransactionalEmailsApi => {
  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  /* node_modules/@getbrevo/brevo/dist/api/transactionalEmailsApi.d.ts
    export declare enum TransactionalEmailsApiApiKeys {
      apiKey = 0,
      partnerKey = 1
    }
  */
  // so SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey is always 0
  // may be it is just
  // apiInstance.setApiKey(1, config.BREVO_KEY)
  // ?????
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.partnerKey, config.BREVO_KEY)
  return apiInstance
}

export const createSmtpEmail = (
  templateId: number,
  to: SibApiV3Sdk.SendSmtpEmailToInner[],
  sender: SibApiV3Sdk.SendSmtpEmailSender,
  replyTo: SibApiV3Sdk.SendSmtpEmailReplyTo,
  params: object,
): SibApiV3Sdk.SendSmtpEmail => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.templateId = templateId
  sendSmtpEmail.to = to
  sendSmtpEmail.sender = sender
  sendSmtpEmail.replyTo = replyTo
  sendSmtpEmail.params = params
  return sendSmtpEmail
}

export const sendSmtpEmail = async (
  smtpEmail: SibApiV3Sdk.SendSmtpEmail,
  contactForm: ContactForm,
): Promise<ReturnType<SibApiV3Sdk.TransactionalEmailsApi['sendTransacEmail']> | undefined> => {
  const apiInstance = createBrevoInstance()sendTransacEmail
      },
      data: {
        ...contactForm,
      },
    })
    return apiResponse
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

export const sendContactFormEmail = (contactForm: ContactForm): Promise<Awaited<ReturnType<typeof sendSmtpEmail>>[]> | undefined => {
  if (!config.BREVO_KEY) {
    return undefined
  }
  console.log(contactForm)
  const smtpEmailToAdmin: SibApiV3Sdk.SendSmtpEmail = createSmtpEmail(
    config.BREVO_TEMPLATE_CONTACT_BASE,
    [
      {
        name: config.BREVO_CONTACT_REQUEST_TO_NAME,
        email: config.BREVO_CONTACT_REQUEST_TO_EMAIL,
      },
    ],
    {
      name: contactForm.firstName + ' ' + contactForm.lastName,
      email: contactForm.email,
    },
    {
      name: contactForm.firstName + ' ' + contactForm.lastName,
      email: contactForm.email,
    },
    {
      email: contactForm.email,
      firstname: contactForm.firstName,
      lastname: contactForm.lastName,
      content: contactForm.content,
    },
  )
  const emailAdmin = sendSmtpEmail(smtpEmailToAdmin, contactForm)

  const smtpEmailToClient: SibApiV3Sdk.SendSmtpEmail = createSmtpEmail(
    config.BREVO_TEMPLATE_CONTACT_USER,
    [
      {
        name: contactForm.firstName + ' ' + contactForm.lastName,
        email: contactForm.email,
      },
    ],
    {
      name: config.BREVO_CONTACT_REQUEST_TO_NAME,
      email: config.BREVO_CONTACT_REQUEST_TO_EMAIL,
    },
    {
      name: config.BREVO_CONTACT_REQUEST_TO_NAME,
      email: config.BREVO_CONTACT_REQUEST_TO_EMAIL,
    },
    {
      firstname: contactForm.firstName,
      lastname: contactForm.lastName,
      content: contactForm.content,
    },
  )
  const emailClient = sendSmtpEmail(smtpEmailToClient, contactForm)
  return Promise.all([emailAdmin, emailClient])
}

export default { createBrevoInstance, createSmtpEmail, sendContactFormEmail, sendSmtpEmail }
