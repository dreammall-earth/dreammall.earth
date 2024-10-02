import { randomBytes } from 'crypto'

import {
  ContactsApi,
  ContactsApiApiKeys,
  CreateContact,
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo'
import { NewsletterPreOptIn } from '@prisma/client'

import { ContactFormInput } from '#graphql/inputs/ContactFormInput'

import { CONFIG_CHECKS, validateConfig } from './configChecks'

import type { CONFIG } from '#config/config'
import type { Logger } from '#src/logger'
import type { PrismaClient } from '#src/prisma'

type Dependencies = {
  prisma: PrismaClient
  config: typeof CONFIG
  logger: Logger
}

const sendContactEmails =
  (dependencies: Dependencies) =>
  async ({
    firstName,
    lastName,
    email,
    content,
  }: ContactFormInput): Promise<
    Awaited<ReturnType<typeof apiInstance.sendTransacEmail>>[] | undefined
  > => {
    const { prisma, config } = dependencies
    // We save this wether config is correctly set or not
    const contactForm = await prisma.contactForm.create({
      data: { firstName, lastName, email, content },
    })

    if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(config)) {
      return undefined
    }

    const apiInstance = new TransactionalEmailsApi()
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)

    const admin = {
      name: config.BREVO_ADMIN_NAME,
      email: config.BREVO_ADMIN_EMAIL,
    }
    const user = {
      name: contactForm.firstName + ' ' + contactForm.lastName,
      email: contactForm.email,
    }

    // Admin Mail
    const smtpEmailToAdmin = new SendSmtpEmail()
    smtpEmailToAdmin.templateId = config.BREVO_CONTACT_TEMPLATE_ADMIN
    smtpEmailToAdmin.to = [admin]
    smtpEmailToAdmin.sender = user
    smtpEmailToAdmin.replyTo = user
    smtpEmailToAdmin.params = contactForm
    const emailAdmin = apiInstance.sendTransacEmail(smtpEmailToAdmin)

    // Client Mail
    const smtpEmailToClient = new SendSmtpEmail()
    smtpEmailToClient.templateId = config.BREVO_CONTACT_TEMPLATE_USER
    smtpEmailToClient.to = [user]
    smtpEmailToClient.sender = admin
    smtpEmailToClient.replyTo = admin
    smtpEmailToClient.params = contactForm
    const emailClient = apiInstance.sendTransacEmail(smtpEmailToClient)

    // Construct result
    const promiseAll = Promise.all([emailAdmin, emailClient])

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

    return promiseAll
  }

export const subscribeToNewsletter =
  (dependencies: Dependencies) =>
  async (firstName: string, lastName: string, email: string): Promise<boolean> => {
    const { prisma, config } = dependencies
    if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_NEWSLETTER(config)) {
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
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, config.BREVO_KEY)

    const admin = {
      name: config.BREVO_ADMIN_NAME,
      email: config.BREVO_ADMIN_EMAIL,
    }

    const user = {
      name: firstName + ' ' + lastName,
      email,
    }

    const smtpEmailToClient = new SendSmtpEmail()
    smtpEmailToClient.templateId = config.BREVO_NEWSLETTER_TEMPLATE_OPTIN
    smtpEmailToClient.to = [user]
    smtpEmailToClient.sender = admin
    smtpEmailToClient.replyTo = admin
    smtpEmailToClient.params = params

    try {
      const brevoResult = await apiInstance.sendTransacEmail(smtpEmailToClient)
      if (brevoResult.response.statusCode === 201 || brevoResult.response.statusCode === 202) {
        await prisma.newsletterPreOptIn.update({
          where: { id: params.id },
          data: { brevoSuccessMail: new Date() },
        })
      } else {
        // TODO: logging or event
      }
    } catch (error) /* eslint-disable-line no-catch-all/no-catch-all */ {
      // TODO: logging or event
    }

    return true
  }

const confirmNewsletter =
  (dependencies: Dependencies) =>
  async (code: string): Promise<false | NewsletterPreOptIn> => {
    const { prisma, config } = dependencies
    if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_NEWSLETTER(config)) {
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
    apiInstance.setApiKey(ContactsApiApiKeys.apiKey, config.BREVO_KEY)

    const contact = new CreateContact()
    contact.email = optin.email
    contact.listIds = [config.BREVO_NEWSLETTER_LIST]
    contact.attributes = {
      VORNAME: optin.firstName,
      NACHNAME: optin.lastName,
    }

    try {
      const brevoResult = await apiInstance.createContact(contact)
      if (brevoResult.response.statusCode === 201 || brevoResult.response.statusCode === 204) {
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
    } catch (error) /* eslint-disable-line no-catch-all/no-catch-all */ {
      // TODO: logging or event
    }

    return optin
  }

export const createBrevoClient = (dependencies: Dependencies) => {
  validateConfig(dependencies)

  return {
    sendContactEmails: sendContactEmails(dependencies),
    subscribeToNewsletter: subscribeToNewsletter(dependencies),
    confirmNewsletter: confirmNewsletter(dependencies),
  }
}
