// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'
import { Resolver, Mutation, Query, Arg } from 'type-graphql'

import { createBrevoInstance, createSmtpEmail } from '#api/NewsletterBrevo'
import { ContactFormInput } from '#inputs/ContactFormInput'
import { NewsletterUser } from '#model/NewsletterUser'
import { prisma } from '#src/prisma'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  async createContactForm(
    @Arg('contactFormData') contactFormData: ContactFormInput,
  ): Promise<boolean> {
    await prisma.contactForm.create({ data: contactFormData })
    // code to send email goes here
    const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = createBrevoInstance()

    const sendSmtpEmail: SibApiV3Sdk.SendSmtpEmail = createSmtpEmail({
      subject: 'My {{params.subject}}',
      emailTo: [
        new NewsletterUser(
          contactFormData.firstName + ' ' + contactFormData.lastName,
          contactFormData.email,
        ),
      ],
      htmlContent:
        '<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>',
      sender: new NewsletterUser('DreamMall Earth Team', 'no-reply@dreammall.earth'),
      cc: [
        new NewsletterUser('Mathias Lenz', 'mathias.lenz@it4c.dev'),
        new NewsletterUser('Hannes Heine', 'hannes.heine@it4c.dev'),
        new NewsletterUser('Ulf Gebhardt', 'ulf.gebhardt@it4c.dev'),
      ],
      replyTo: new NewsletterUser('DreamMall Earth', 'contact@dreammall.earth'),
      params: { parameter: 'My param value', subject: 'New Subject' },
      headers: { 'Some-Custom-Name': 'unique-id-1234' },
    })

    void apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        // eslint-disable-next-line no-console
        console.log('API called successfully. Returned data: ', JSON.stringify(data))
        return data
      },
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      function (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return error
      },
    )
    return true
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
