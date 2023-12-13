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
    const apiInstance: SibApiV3Sdk.TransactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi()
    const brevoKey = '12345' // TODO: process.env.BREVO_KEY as string
    console.log('Brevo API_KEY', brevoKey)
    apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, brevoKey)

    const sendSmtpEmail: SibApiV3Sdk.SendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
    sendSmtpEmail.subject = ''
    sendSmtpEmail.htmlContent = ''
    sendSmtpEmail.sender = {"name":"John Doe","email":"example@example.com"}
    sendSmtpEmail.to = [{"email":"example@example.com","name":"Jane Doe"}]
    sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}]
    sendSmtpEmail.bcc = [{"name":"John Doe","email":"example@example.com"}]
    sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"}
    sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"}
    sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"}

    return true
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
