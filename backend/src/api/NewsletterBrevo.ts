// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm, NewsletterSubscription } from '@prisma/client'

import config from '#config/config'

import { SmtpEmailResponse } from './type/SmtpEmailResponse'

const createBrevoInstance = (): SibApiV3Sdk.TransactionalEmailsApi => {
  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)
  return apiInstance
}

const createBrevoContactsApi = (): SibApiV3Sdk.ContactsApi => {
  const apiInstance = new SibApiV3Sdk.ContactsApi()
  apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, config.BREVO_KEY)
  return apiInstance
}

const createAddContactToList = (contactForm: NewsletterSubscription): SibApiV3Sdk.CreateContact => {
  const createContact: SibApiV3Sdk.CreateContact = new SibApiV3Sdk.CreateContact()
  createContact.email = contactForm.email
  createContact.listIds = [config.BREVO_CONTACT_LIST_ID]
  createContact.attributes = {
    VORNAME: contactForm.firstName,
    NACHNAME: contactForm.lastName,
  }
  return createContact
}

const createSmtpEmail = (
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

const sendSmtpEmail = (smtpEmail: SibApiV3Sdk.SendSmtpEmail): Promise<SmtpEmailResponse> => {
  const apiInstance = createBrevoInstance()
  return apiInstance.sendTransacEmail(smtpEmail)
}

export const sendContactFormEmail = (
  contactForm: ContactForm,
): Promise<[SmtpEmailResponse, SmtpEmailResponse]> => {
  if (!config.BREVO_KEY) {
    throw new Error('No Brevo_Key defined could not send email')
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
      firstname: contactForm.firstName,
      lastname: contactForm.lastName,
      content: contactForm.content,
    },
  )

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
  const sendEmailClient: Promise<SmtpEmailResponse> = sendSmtpEmail(smtpEmailToClient)
  const sendEmailAdmin: Promise<SmtpEmailResponse> = sendSmtpEmail(smtpEmailToAdmin)
  return Promise.all([sendEmailClient, sendEmailAdmin])
}

export const sendContactToBrevo = (contactForm: NewsletterSubscription): void => {
  if (config.BREVO_KEY) {
    const createContact: SibApiV3Sdk.CreateContact = createAddContactToList(contactForm)
    const apiInstance = createBrevoContactsApi()
    void apiInstance.createContact(createContact).then(
      async (data) => {
        // eslint-disable-next-line no-console
        console.log('API called successfully. Returned data: ', JSON.stringify(data))
        // code to store success goes here:
        contactForm.brevoSuccess = new Date()
        await prisma.newsletterSubscription.update({
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
}
