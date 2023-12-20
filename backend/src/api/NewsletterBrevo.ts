// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'

export const sendSmtpEmail = async (
  smtpEmail: SibApiV3Sdk.SendSmtpEmail,
  contactForm: ContactForm,
): Promise<ReturnType<SibApiV3Sdk.TransactionalEmailsApi['sendTransacEmail']> | undefined> => {
  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)

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
  if (!config.BREVO_KEY) {
    return undefined
  }

  // Admin Mail
  const smtpEmailToAdmin = new SibApiV3Sdk.SendSmtpEmail()
  smtpEmailToAdmin.templateId = config.BREVO_TEMPLATE_CONTACT_BASE
  smtpEmailToAdmin.to = [
    {
      name: config.BREVO_CONTACT_REQUEST_TO_NAME,
      email: config.BREVO_CONTACT_REQUEST_TO_EMAIL,
    },
  ]
  smtpEmailToAdmin.sender = {
    name: contactForm.firstName + ' ' + contactForm.lastName,
    email: contactForm.email,
  }
  smtpEmailToAdmin.replyTo = {
    name: contactForm.firstName + ' ' + contactForm.lastName,
    email: contactForm.email,
  }
  smtpEmailToAdmin.params = {
    email: contactForm.email,
    firstName: contactForm.firstName,
    lastName: contactForm.lastName,
    content: contactForm.content,
  }
  const emailAdmin = sendSmtpEmail(smtpEmailToAdmin, contactForm)

  // Client Mail
  const smtpEmailToClient = new SibApiV3Sdk.SendSmtpEmail()
  smtpEmailToClient.templateId = config.BREVO_TEMPLATE_CONTACT_USER
  smtpEmailToClient.to = [
    {
      name: contactForm.firstName + ' ' + contactForm.lastName,
      email: contactForm.email,
    },
  ]
  smtpEmailToClient.sender = {
    name: config.BREVO_CONTACT_REQUEST_TO_NAME,
    email: config.BREVO_CONTACT_REQUEST_TO_EMAIL,
  }
  smtpEmailToClient.replyTo = {
    name: config.BREVO_CONTACT_REQUEST_TO_NAME,
    email: config.BREVO_CONTACT_REQUEST_TO_EMAIL,
  }
  smtpEmailToClient.params = {
    firstName: contactForm.firstName,
    lastName: contactForm.lastName,
    content: contactForm.content,
  }
  const emailClient = sendSmtpEmail(smtpEmailToClient, contactForm)

  return Promise.all([emailAdmin, emailClient])
}
