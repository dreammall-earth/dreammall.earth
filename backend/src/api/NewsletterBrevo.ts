// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'

export const createBrevoInstance = (): SibApiV3Sdk.TransactionalEmailsApi => {
  if (!config.BREVO_KEY) {
    throw new Error('BREVO_KEY missing')
  }
  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)
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
  const apiInstance = createBrevoInstance()

  try {
    const apiResponse = await apiInstance.sendTransacEmail(smtpEmail)
    contactForm.brevoSuccess = new Date()
    await prisma.contactForm.update({
      where: {
        id: contactForm.id,
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

export const sendContactFormEmail = (
  contactForm: ContactForm,
): Promise<Awaited<ReturnType<typeof sendSmtpEmail>>[]> | undefined => {
  if (
    !config.BREVO_KEY ||
    !config.BREVO_TEMPLATE_CONTACT_BASE ||
    !config.BREVO_TEMPLATE_CONTACT_USER ||
    !config.BREVO_CONTACT_REQUEST_TO_NAME ||
    !config.BREVO_CONTACT_REQUEST_TO_EMAIL
  ) {
    // TODO log
    return undefined
  }
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
      firstName: contactForm.firstName,
      lastName: contactForm.lastName,
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
      firstName: contactForm.firstName,
      lastName: contactForm.lastName,
      content: contactForm.content,
    },
  )
  const emailClient = sendSmtpEmail(smtpEmailToClient, contactForm)
  return Promise.all([emailAdmin, emailClient])
}
