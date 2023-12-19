import { Resolver, Mutation, Query, Arg } from 'type-graphql'

import { sendContactFormEmail } from '#api/NewsletterBrevo'
import { ContactFormInput } from '#inputs/ContactFormInput'
import { prisma } from '#src/prisma'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  async createContactForm(
    @Arg('contactFormData') contactFormData: ContactFormInput,
  ): Promise<boolean> {
    const contactForm = await prisma.contactForm.create({ data: contactFormData })
    const promise = sendContactFormEmail(contactForm)
    if (promise) {
      void promise.then(() => {
        // console.log('API called successfully. Returned data: ', JSON.stringify(data))
        contactForm.brevoSuccess = new Date()
        void prisma.contactForm.update({
          where: {
            id: contactForm.id,
          },
          data: {
            ...contactForm,
          },
        })
        return undefined
      })
    }
    return true
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
