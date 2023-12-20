// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'

export const sendContactFormEmail = (
  contactForm: ContactForm,
): Promise<Awaited<ReturnType<typeof apiInstance.sendTransacEmail>>[]> | undefined => {
  if (!config.BREVO_KEY) {
    return undefined
  }

  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)

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
  const emailAdmin = apiInstance.sendTransacEmail(smtpEmailToAdmin)

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
  const emailClient = apiInstance.sendTransacEmail(smtpEmailToClient)

  // Construct result
  const promiseAll = Promise.all([emailAdmin, emailClient])

  // Update database once both promises came back
  void promiseAll
    .then(async () => {
      contactForm.brevoSuccess = new Date()
      await prisma.contactForm.update({
        where: {
          id: contactForm.id,
        },
        data: {
          ...contactForm,
        },
      })
      return undefined
    })
    .catch(() => {
      // TODO log
    })

  // Return unresolved promise
  return promiseAll
}
