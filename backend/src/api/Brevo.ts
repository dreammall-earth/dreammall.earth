// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm, NewsletterSubscription } from '@prisma/client'

import { CONFIG, CONFIG_CHECKS } from '#config/config'
import { prisma } from '#src/prisma'

export const sendContactEmails = async (
  contactForm: ContactForm,
): Promise<Awaited<ReturnType<typeof apiInstance.sendTransacEmail>>[] | undefined> => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(CONFIG)) {
    return undefined
  }

  const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, CONFIG.BREVO_KEY)

  const admin = {
    name: CONFIG.BREVO_ADMIN_NAME,
    email: CONFIG.BREVO_ADMIN_EMAIL,
  }
  const user = {
    name: contactForm.firstName + ' ' + contactForm.lastName,
    email: contactForm.email,
  }

  // Admin Mail
  const smtpEmailToAdmin = new SibApiV3Sdk.SendSmtpEmail()
  smtpEmailToAdmin.templateId = CONFIG.BREVO_CONTACT_TEMPLATE_ADMIN
  smtpEmailToAdmin.to = [admin]
  smtpEmailToAdmin.sender = user
  smtpEmailToAdmin.replyTo = user
  smtpEmailToAdmin.params = contactForm
  const emailAdmin = apiInstance.sendTransacEmail(smtpEmailToAdmin)

  // Client Mail
  const smtpEmailToClient = new SibApiV3Sdk.SendSmtpEmail()
  smtpEmailToClient.templateId = CONFIG.BREVO_CONTACT_TEMPLATE_USER
  smtpEmailToClient.to = [user]
  smtpEmailToClient.sender = admin
  smtpEmailToClient.replyTo = admin
  smtpEmailToClient.params = contactForm
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

export const subscribeToNewsletter = async (
  newsletterSubscription: NewsletterSubscription,
): Promise<Awaited<ReturnType<typeof apiInstance.createContact>> | undefined> => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SUBSCRIBE_NEWSLETTER(CONFIG)) {
    return undefined
  }

  const apiInstance = new SibApiV3Sdk.ContactsApi()
  apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, CONFIG.BREVO_KEY)

  // Create ContactBREVO_CONTACT_LIST_ID
  const contact = new SibApiV3Sdk.CreateContact()
  contact.email = newsletterSubscription.email
  contact.listIds = [CONFIG.BREVO_NEWSLETTER_LIST]
  contact.attributes = {
    VORNAME: newsletterSubscription.firstName,
    NACHNAME: newsletterSubscription.lastName,
  }

  // Send to Brevo
  const promise = apiInstance.createContact(contact)

  // Update database once promise came back
  try {
    await promise
    // console.log('API called successfully. Returned data: ', JSON.stringify(data))
    // code to store success goes here:
    newsletterSubscription.brevoSuccess = new Date()
    await prisma.newsletterSubscription.update({
      where: {
        id: newsletterSubscription.id,
      },
      data: {
        ...newsletterSubscription,
      },
    })
  } catch (error) {
    // TODO: logging or event
  }

  return promise
}
