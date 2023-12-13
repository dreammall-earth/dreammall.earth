// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@sendinblue/client'
import { Resolver, Mutation, Query, Arg } from 'type-graphql'

import { ContactFormInput } from '#inputs/ContactFormInput'
import { prisma } from '#src/prisma'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  async createContactForm(
    @Arg('contactFormData') contactFormData: ContactFormInput,
  ): Promise<boolean> {
    await prisma.contactForm.create({ data: contactFormData })
    // code to send email goes here
    const apiInstance = this.createBrevoInstance()
    const sendSmtpEmail = this.createSmtpEmail()

    try {
      void apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        // eslint-disable-next-line no-console
        console.log('API called successfully. Returned data: ', JSON.stringify(data))
        return true
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return false
    }
    return true
  }

  private createBrevoInstance(): SibApiV3Sdk.TransactionalEmailsApi {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, '12345')
    return apiInstance
  }

  private createSmtpEmail(): SibApiV3Sdk.SendSmtpEmail {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.subject = 'My {{params.subject}}'
    sendSmtpEmail.htmlContent =
      '<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>'
    sendSmtpEmail.sender = { name: 'John Doe', email: 'example@example.com' }
    sendSmtpEmail.to = [{ email: 'hannes.heine@it4c.dev', name: 'Hannes Heine' }]
    sendSmtpEmail.cc = [{ email: 'mathias.lenz@it4c.dev', name: 'Mathias Lenz' }]
    sendSmtpEmail.bcc = [{ name: 'Ulf Gebhardt', email: 'ulf.gebhardt@it4c.dev' }]
    sendSmtpEmail.replyTo = { email: 'info@it4c.dev', name: 'IT4C Support' }
    sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' }
    sendSmtpEmail.params = { parameter: 'My param value', subject: 'New Subject' }

    return sendSmtpEmail
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
