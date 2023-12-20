// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm, NewsletterSubscription } from '@prisma/client'

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

export const createBrevoContactsApi = () => {
  if (!config.BREVO_KEY) {
    throw new Error('BREVO_KEY missing')
  }

  const apiBrevoContactsInstance = new SibApiV3Sdk.ContactsApi()
  apiBrevoContactsInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, config.BREVO_KEY)
  return apiBrevoContactsInstance
}

export const createAddContactToList = (contactForm: NewsletterSubscription) => {
  if (!config.BREVO_CONTACT_LIST_ID) {
    throw new Error('BREVO_CONTACT_LIST_ID missing')
  }
  const createContact = new SibApiV3Sdk.CreateContact()
  createContact.email = contactForm.email
  createContact.listIds = [config.BREVO_CONTACT_LIST_ID]
  createContact.attributes = {
    VORNAME: contactForm.firstName,
    NACHNAME: contactForm.lastName,
  }
  return createContact
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
): Promise<ReturnType<SibApiV3Sdk.TransactionalEmailsApi['sendTransacEmail']>> => {
  const apiInstance = createBrevoInstance()
  return apiInstance.sendTransacEmail(smtpEmail)
}

export const sendContactFormEmail = async (
  contactForm: ContactForm,
): Promise<Awaited<ReturnType<typeof sendSmtpEmail>>[] | undefined> => {
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
  const sendEmailClient = sendSmtpEmail(smtpEmailToClient)
  const sendEmailAdmin = sendSmtpEmail(smtpEmailToAdmin)
  const promiseAll = Promise.all([sendEmailAdmin, sendEmailClient])

  try {
    await promiseAll

    contactForm.brevoSuccess = new Date()
    await prisma.contactForm.update({
      where: {
        id: contactForm.id,
      },
      data: {
        ...contactForm,
      },
    })
  } catch (error) {
    // TODO log
  }

  return promiseAll
}

export const sendContactToBrevo = async (contactForm: NewsletterSubscription): Promise<boolean> => {
  if (!config.BREVO_KEY) {
    return false
  }
  const createContact: SibApiV3Sdk.CreateContact = createAddContactToList(contactForm)
  const apiInstance = createBrevoContactsApi()
  const createContactPromise = apiInstance.createContact(createContact)
  try {
    await createContactPromise
    // console.log('API called successfully. Returned data: ', JSON.stringify(data))
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
  } catch (error) {
    // TODO: logging or event
    return false
  }
  return true
}
