// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'

import config from '#config/config'
import { NewsletterEmailAttributes } from '#src/model/NewsletterEmailAttributes'

export const createBrevoInstance = (): SibApiV3Sdk.TransactionalEmailsApi => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)
  return apiInstance
}

export const createSmtpEmail = (
  emailAttributes: NewsletterEmailAttributes,
): SibApiV3Sdk.SendSmtpEmail => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.subject = emailAttributes.subject
  sendSmtpEmail.htmlContent = emailAttributes.htmlContent
  sendSmtpEmail.sender = emailAttributes.sender
  sendSmtpEmail.to = emailAttributes.emailTo
  sendSmtpEmail.cc = emailAttributes.cc
  sendSmtpEmail.bcc = emailAttributes.bcc
  sendSmtpEmail.replyTo = emailAttributes.replyTo
  sendSmtpEmail.headers = emailAttributes.headers
  sendSmtpEmail.params = emailAttributes.params

  return sendSmtpEmail
}
