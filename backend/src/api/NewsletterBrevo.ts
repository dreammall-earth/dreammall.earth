// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm, NewsletterSubscription } from '@prisma/client'

import { CONFIG, CONFIG_CHECKS } from '#config/config'
import { prisma } from '#src/prisma'

export const sendContactFormEmail = async (
  contactForm: ContactForm,
): Promise<Awaited<ReturnType<typeof apiInstance.sendTransacEmail>>[] | undefined> => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(CONFIG)) {
    return undefined
  }

  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, CONFIG.BREVO_KEY)

  // Admin Mail
  const smtpEmailToAdmin = new SibApiV3Sdk.SendSmtpEmail()
  smtpEmailToAdmin.templateId = CONFIG.BREVO_TEMPLATE_CONTACT_BASE
  smtpEmailToAdmin.to = [
    {
      name: CONFIG.BREVO_CONTACT_REQUEST_TO_NAME,
      email: CONFIG.BREVO_CONTACT_REQUEST_TO_EMAIL,
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
  smtpEmailToClient.templateId = CONFIG.BREVO_TEMPLATE_CONTACT_USER
  smtpEmailToClient.to = [
    {
      name: contactForm.firstName + ' ' + contactForm.lastName,
      email: contactForm.email,
    },
  ]
  smtpEmailToClient.sender = {
    name: CONFIG.BREVO_CONTACT_REQUEST_TO_NAME,
    email: CONFIG.BREVO_CONTACT_REQUEST_TO_EMAIL,
  }
  smtpEmailToClient.replyTo = {
    name: CONFIG.BREVO_CONTACT_REQUEST_TO_NAME,
    email: CONFIG.BREVO_CONTACT_REQUEST_TO_EMAIL,
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

export const createBrevoContactsApi = () => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SUBSCRIBE_NEWSLETTER(CONFIG)) {
    throw new Error('BREVO_KEY missing')
  }

  const apiBrevoContactsInstance = new SibApiV3Sdk.ContactsApi()
  apiBrevoContactsInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, CONFIG.BREVO_KEY)
  return apiBrevoContactsInstance
}

export const createAddContactToList = (contactForm: NewsletterSubscription) => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SUBSCRIBE_NEWSLETTER(CONFIG)) {
    throw new Error('BREVO_CONTACT_LIST_ID missing')
  }
  const createContact = new SibApiV3Sdk.CreateContact()
  createContact.email = contactForm.email
  createContact.listIds = [CONFIG.BREVO_CONTACT_LIST_ID]
  createContact.attributes = {
    VORNAME: contactForm.firstName,
    NACHNAME: contactForm.lastName,
  }
  return createContact
}

export const sendContactToBrevo = async (
  contactForm: NewsletterSubscription,
): Promise<Awaited<ReturnType<typeof apiInstance.createContact>> | undefined> => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(CONFIG)) {
    return undefined
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
  }
  return createContactPromise
}
