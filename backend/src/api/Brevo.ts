import { randomBytes } from 'crypto'

import {
  ContactsApiApiKeys,
  CreateContact,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import { CONFIG, CONFIG_CHECKS } from '#config/config'
import { prisma } from '#src/prisma'

import { ContactsApi, TransactionalEmailsApi } from './BrevoDebuggableApi'

export const sendContactEmails = async (
  contactForm: ContactForm,
): Promise<Awaited<ReturnType<typeof apiInstance.sendTransacEmail>>[] | undefined> => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(CONFIG)) {
    return undefined
  }

  const apiInstance = new TransactionalEmailsApi()
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, CONFIG.BREVO_KEY)

  const admin = {
    name: CONFIG.BREVO_ADMIN_NAME,
    email: CONFIG.BREVO_ADMIN_EMAIL,
  }
  const user = {
    name: contactForm.firstName + ' ' + contactForm.lastName,
    email: contactForm.email,
  }

  // Admin Mail
  const smtpEmailToAdmin = new SendSmtpEmail()
  smtpEmailToAdmin.templateId = CONFIG.BREVO_CONTACT_TEMPLATE_ADMIN
  smtpEmailToAdmin.to = [admin]
  smtpEmailToAdmin.sender = user
  smtpEmailToAdmin.replyTo = user
  smtpEmailToAdmin.params = contactForm
  const emailAdmin = apiInstance.sendTransacEmail(smtpEmailToAdmin)

  // Client Mail
  const smtpEmailToClient = new SendSmtpEmail()
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
  firstName: string,
  lastName: string,
  email: string,
): Promise<boolean> => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_NEWSLETTER(CONFIG)) {
    return false
  }

  // record time
  const time = new Date()
  const time10MinAgo = new Date(time.getTime() - 10 * 60 * 1000)
  const validTill = new Date(time)
  validTill.setDate(validTill.getDate() + 30)

  // check for a code younger than 10min
  if (
    await prisma.newsletterPreOptIn.findFirst({
      where: {
        email,
        createdAt: {
          gte: time10MinAgo,
        },
        deletedAt: null,
      },
    })
  ) {
    throw new Error('Please try later again')
  }

  // find valid code
  let code = null
  while (!code) {
    code = randomBytes(8).toString('hex')
    if (await prisma.newsletterPreOptIn.count({ where: { code } })) {
      code = null
    }
  }

  // softdelete all valid codes (older than 10min)
  await prisma.newsletterPreOptIn.deleteMany({
    where: {
      email,
    },
  })

  // insert new code
  const params = await prisma.newsletterPreOptIn.create({
    data: {
      firstName,
      lastName,
      email,
      code,
      validTill,
    },
  })

  // Send email
  const apiInstance = new TransactionalEmailsApi()
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, CONFIG.BREVO_KEY)

  const admin = {
    name: CONFIG.BREVO_ADMIN_NAME,
    email: CONFIG.BREVO_ADMIN_EMAIL,
  }

  const user = {
    name: firstName + ' ' + lastName,
    email,
  }

  const smtpEmailToClient = new SendSmtpEmail()
  smtpEmailToClient.templateId = CONFIG.BREVO_NEWSLETTER_TEMPLATE_OPTIN
  smtpEmailToClient.to = [user]
  smtpEmailToClient.sender = admin
  smtpEmailToClient.replyTo = admin
  smtpEmailToClient.params = params

  try {
    const brevoResult = await apiInstance.sendTransacEmail(smtpEmailToClient)
    if (brevoResult.response.statusCode === 200) {
      await prisma.newsletterPreOptIn.update({
        where: { id: params.id },
        data: { brevoSuccessMail: new Date() },
      })
    } else {
      // TODO: logging or event
    }
  } catch (error) {
    // TODO: logging or event
  }

  return true
}

export const confirmNewsletter = async (code: string): Promise<boolean> => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_NEWSLETTER(CONFIG)) {
    return false
  }

  // validate code
  const optin = await prisma.newsletterPreOptIn.findFirst({
    where: { code, validTill: { gte: new Date() }, deletedAt: null },
  })
  if (!optin) {
    // Code invalid
    return false
  }

  // put in brevo list
  const apiInstance = new ContactsApi()
  apiInstance.setApiKey(ContactsApiApiKeys.apiKey, CONFIG.BREVO_KEY)

  const contact = new CreateContact()
  contact.email = optin.email
  contact.listIds = [CONFIG.BREVO_NEWSLETTER_LIST]
  contact.attributes = {
    VORNAME: optin.firstName,
    NACHNAME: optin.lastName,
  }

  try {
    const brevoResult = await apiInstance.createContact(contact)
    if (brevoResult.response.statusCode === 200) {
      const brevoSuccessDate = new Date()
      await prisma.newsletterPreOptIn.update({
        where: { id: optin.id },
        data: { brevoSuccessList: brevoSuccessDate, deletedAt: brevoSuccessDate },
      })
      // Insert into NewsletterSubscription
      await prisma.newsletterSubscription.deleteMany({ where: { email: optin.email } })
      await prisma.newsletterSubscription.create({
        data: {
          email: optin.email,
          firstName: optin.firstName,
          lastName: optin.lastName,
        },
      })
    } else {
      // TODO: logging or event
    }
  } catch (error) {
    // TODO: logging or event
  }

  return true
}
