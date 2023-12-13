import { Resolver, Mutation, Query, Arg } from 'type-graphql'
import * as SibApiV3Sdk from '@getbrevo/brevo'
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

    apiInstance.sendTransacEmail(sendSmtpEmail).then((data) => {
      console.log('API called successfully. Returned data: ' + data)
      return true
    }, function(error) {
      console.error(error)
    })
    return false
  }

  private createBrevoInstance(): SibApiV3Sdk.TransactionalEmailsApi {
    const SibApiV3Sdk = require('@getbrevo/brevo')
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    const apiKey = apiInstance.authentications['apiKey']
    apiKey.apiKey = '12345'
    return apiInstance
  }

  private createSmtpEmail(): SibApiV3Sdk.SendSmtpEmail {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.subject = "My {{params.subject}}"
    sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
    sendSmtpEmail.sender = { "name": "John Doe", "email": "example@example.com" }
    sendSmtpEmail.to = [{ "email": "hannes.heine@it4c.dev", "name": "Hannes Heine" }]
    sendSmtpEmail.cc = [{ "email": "mathias.lenz@it4c.dev", "name": "Mathias Lenz" }]
    sendSmtpEmail.bcc = [{ "name": "Ulf Gebhardt", "email": "ulf.gebhardt@it4c.dev" }]
    sendSmtpEmail.replyTo = { "email": "info@it4c.dev", "name": "IT4C Support" }
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" }
    sendSmtpEmail.params = { "parameter": "My param value", "subject": "New Subject" }

    return sendSmtpEmail
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
