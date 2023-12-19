// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm, NewsletterSubscription } from '@prisma/client'

import config from '#config/config'
import { prisma } from '#src/prisma'

export const createBrevoInstance = () => {
  const apiTransactionalEmailInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  apiTransactionalEmailInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    config.BREVO_KEY,
  )
  return apiTransactionalEmailInstance
}

export const createBrevoContactsApi = () => {
  const apiBrevoContactsInstance = new SibApiV3Sdk.ContactsApi()
  apiBrevoContactsInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, config.BREVO_KEY)
  return apiBrevoContactsInstance
}

export const createAddContactToList = (contactForm: NewsletterSubscription) => {
  const createContact: SibApiV3Sdk.CreateContact = new SibApiV3Sdk.CreateContact()
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
    // TODO: logging or event
  }
}

export const sendContactFormEmail = async (contactForm: ContactForm): Promise<boolean> => {
  if (!config.BREVO_KEY) {
    return false
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
  const sendEmailClient = sendSmtpEmail(smtpEmailToClient, contactForm)
  const sendEmailAdmin = sendSmtpEmail(smtpEmailToAdmin, contactForm)
  const sendAllEmail = Promise.all([sendEmailAdmin, sendEmailClient])
  try {
    await sendAllEmail.then(() => {
      // console.log('API called successfully. Returned data: ', JSON.stringify(data))
      contactForm.brevoSuccess = new Date()
      void prisma.contactForm.update({
        where: {
          id: contactForm.id,
        },
        data: {
          ...contactForm,
        },
      })
      return undefined
    })
  } catch (error) {
    // TODO: logging or event
    return false
  }
  return true
}

export const sendContactToBrevo = async (contactForm: NewsletterSubscription): Promise<boolean> => {
  if (!config.BREVO_KEY) {
    return false
  }
  const createContact: SibApiV3Sdk.CreateContact = createAddContactToList(contactForm)
  const apiInstance = createBrevoContactsApi()
  const promise = apiInstance.createContact(createContact)
  try {
    await promise.then(async () => {
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
      return undefined
    })
  } catch (error) {
    // TODO: logging or event
    return false
  }
  return true
}
