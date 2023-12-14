// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { ContactForm } from '@prisma/client'
import { Resolver, Mutation, Query, Arg } from 'type-graphql'

import { createSmtpEmail, sendSmtpEmail } from '#api/NewsletterBrevo'
import config from '#config/config'
import { ContactFormInput } from '#inputs/ContactFormInput'
import { prisma } from '#src/prisma'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  async createContactForm(
    @Arg('contactFormData') contactFormData: ContactFormInput,
  ): Promise<boolean> {
    const contactForm: ContactForm = await prisma.contactForm.create({ data: contactFormData })
    // code to send email goes here
    const smtpEmailToAdmin: SibApiV3Sdk.SendSmtpEmail = createSmtpEmail(
      1,
      [
        {
          name: config.BREVO_CONTACT_REQUEST_TO_NAME,
          email: config.BREVO_CONTACT_REQUEST_TO_EMAIL,
        },
      ],
      {
        name: contactFormData.firstName + ' ' + contactFormData.lastName,
        email: contactFormData.email,
      },
      {
        name: contactFormData.firstName + ' ' + contactFormData.lastName,
        email: contactFormData.email,
      },
      {
        email: contactFormData.email,
        firstname: contactFormData.firstName,
        lastname: contactFormData.lastName,
        content: contactFormData.content,
      },
    )
    void sendSmtpEmail(smtpEmailToAdmin, contactForm)
    const smtpEmailToClient: SibApiV3Sdk.SendSmtpEmail = createSmtpEmail(
      2,
      [
        {
          name: contactFormData.firstName + ' ' + contactFormData.lastName,
          email: contactFormData.email,
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
        firstname: contactFormData.firstName,
        lastname: contactFormData.lastName,
        content: contactFormData.content,
      },
    )
    void sendSmtpEmail(smtpEmailToClient, contactForm)
    return true
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
