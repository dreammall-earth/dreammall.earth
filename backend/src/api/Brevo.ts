import { randomBytes } from 'crypto'

import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'

import { CONFIG, CONFIG_CHECKS } from '#config/config'
import { prisma } from '#src/prisma'

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
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SUBSCRIBE_NEWSLETTER(CONFIG)) {
    return false
  }

  // record time
  const time = new Date()
  const time10MinAgo = new Date(time.getTime() - 10 * 60 * 1000)
  const validTill = new Date(time)
  validTill.setDate(validTill.getDate() + 30)

  // check for a code younger than 10min
  const validCode = await prisma.newsletterPreOptIn.findFirst({
    where: {
      email,
      createdAt: {
        gte: time10MinAgo,
      },
      deletedAt: null,
    },
  })
  if (validCode) {
    throw new Error('Please try later again')
  }

  // find valid code
  // TODO: increase database field to 32 chars, 16 bytes as 32hex or 24 bytes as base64
  let code = null
  while (!code) {
    code = randomBytes(12).toString('base64')
    if ((await prisma.newsletterPreOptIn.count({ where: { code } })) > 0) {
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
  const emailPromise = apiInstance.sendTransacEmail(smtpEmailToClient)

  // Detach waiting for brevo so we can return
  void (async () => {
    try {
      const brevoResult = await emailPromise
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
  })()

  return true
}
