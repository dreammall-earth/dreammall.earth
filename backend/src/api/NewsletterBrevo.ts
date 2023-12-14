// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'

const createBrevoInstance = (): SibApiV3Sdk.TransactionalEmailsApi => {
  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  if (config.BREVO_KEY) {
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)
  }
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

export const sendSmtpEmail = (
  smtpEmail: SibApiV3Sdk.SendSmtpEmail,
  contactForm: ContactForm,
): void => {
  const apiInstance = createBrevoInstance()

  void apiInstance.sendTransacEmail(smtpEmail).then(
    async (data) => {
      // eslint-disable-next-line no-console
      console.log('API called successfully. Returned data: ', JSON.stringify(data))
      // code to store success goes here:
      contactForm.brevoSuccess = new Date()
      await prisma.contactForm.update({
        where: {
          id: contactForm.id,
        },
        data: {
          ...contactForm,
        },
      })
      return true
    },
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    function (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    },
  )
}
