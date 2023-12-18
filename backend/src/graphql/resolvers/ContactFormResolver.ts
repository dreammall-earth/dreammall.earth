import { ContactForm } from '@prisma/client'
import { Resolver, Mutation, Query, Arg } from 'type-graphql'

import { sendContactFormEmail } from '#api/NewsletterBrevo'
import { SmtpEmailResponse } from '#api/type/SmtpEmailResponse'
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
    try {
      const contactFormEmailPromise: Promise<[SmtpEmailResponse, SmtpEmailResponse]> =
        sendContactFormEmail(contactForm)
      await contactFormEmailPromise.then(async (data) => {
        // eslint-disable-next-line no-console
        console.log('API called successfully. Returned data: ', JSON.stringify(data))
        // code to store success goes here:
        contactForm.brevoSuccess = new Date()
        await prisma.contactForm.update({
          where: {
            id: contactForm.id,
          },
          data: {
            ...contactForm,
          },
        })
        return true
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    return true
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
