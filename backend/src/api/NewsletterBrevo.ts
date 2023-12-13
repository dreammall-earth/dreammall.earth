// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'

import config from '#config/config'

export const createBrevoInstance = (): SibApiV3Sdk.TransactionalEmailsApi => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)
  return apiInstance
}

export const createSmtpEmail = (): SibApiV3Sdk.SendSmtpEmail => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.subject = 'My {{params.subject}}'
  sendSmtpEmail.htmlContent =
    '<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>'
  sendSmtpEmail.sender = { name: 'John Doe', email: 'example@example.com' }
  sendSmtpEmail.to = [{ email: 'hannes.heine@it4c.dev', name: 'Hannes Heine' }]
  sendSmtpEmail.cc = [{ email: 'mathias.lenz@it4c.dev', name: 'Mathias Lenz' }]
  sendSmtpEmail.bcc = [{ name: 'Ulf Gebhardt', email: 'ulf.gebhardt@it4c.dev' }]
  sendSmtpEmail.replyTo = { email: 'info@it4c.dev', name: 'IT4C Support' }
  sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' }
  sendSmtpEmail.params = { parameter: 'My param value', subject: 'New Subject' }

  return sendSmtpEmail
}