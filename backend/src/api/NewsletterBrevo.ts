// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'

export const createBrevoInstance = (contactFormData: ContactForm): void => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  if (!config.BREVO_KEY) {
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)
    void createSmtpEmail(apiInstance, contactFormData)
  }
}

function createSmtpEmail(
  apiInstance: SibApiV3Sdk.TransactionalEmailsApi,
  contactFormData: ContactForm,
) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.subject = 'My {{params.subject}}'
  sendSmtpEmail.htmlContent =
    '<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>'
  sendSmtpEmail.sender = { name: 'DreamMall Earth Team', email: 'no-reply@dreammall.earth' }
  sendSmtpEmail.to = [
    {
      name: contactFormData.firstName + ' ' + contactFormData.lastName,
      email: contactFormData.email,
    },
  ]
  sendSmtpEmail.replyTo = { name: 'DreamMall Earth', email: 'contact@dreammall.earth' }
  sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' }
  sendSmtpEmail.params = { parameter: 'My param value', subject: 'New Subject' }
  void apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      // eslint-disable-next-line no-console
      console.log('API called successfully. Returned data: ', JSON.stringify(data))
      return true
    },
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    function (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    },
  )
}
