// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import config from '#config/config'

const createBrevoInstance = (): SibApiV3Sdk.TransactionalEmailsApi => {
  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  if (config.BREVO_KEY) {
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)
  }
  return apiInstance
}

export const sendSmtpEmail = (contactFormData: ContactForm): void => {
  const apiInstance = createBrevoInstance()
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.templateId = 1
  sendSmtpEmail.to = [
    {
      name: config.BREVO_CONTACT_REQUEST_TO_NAME,
      email: config.BREVO_CONTACT_REQUEST_TO_EMAIL,
    },
  ]
  sendSmtpEmail.sender = {
    name: contactFormData.firstName + ' ' + contactFormData.lastName,
    email: contactFormData.email,
  }
  sendSmtpEmail.replyTo = {
    name: contactFormData.firstName + ' ' + contactFormData.lastName,
    email: contactFormData.email,
  }
  sendSmtpEmail.params = {
    email: contactFormData.email,
    firstname: contactFormData.firstName,
    lastname: contactFormData.lastName,
    content: contactFormData.content,
  }
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
