import { NewsletterSubscription } from '@prisma/client'
import { Resolver, Mutation, Arg } from 'type-graphql'

import { sendContactToBrevo } from '#api/NewsletterBrevo'
import { CreateContactResponse } from '#api/type/CreateContactResponse'
import { SubscribeToNewsletterInput } from '#inputs/SubscribeToNewsletterInput'
import { prisma } from '#src/prisma'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Arg('subscribeToNewsletterData') subscribeToNewsletterData: SubscribeToNewsletterInput,
  ): Promise<boolean> {
    const subscriber: NewsletterSubscription = await prisma.newsletterSubscription.create({
      data: subscribeToNewsletterData,
    })
    try {
      const contactToBrevoPromise: Promise<CreateContactResponse> = sendContactToBrevo(subscriber)
      await contactToBrevoPromise.then(async (data) => {
        // eslint-disable-next-line no-console
        console.log('API called successfully. Returned data: ', JSON.stringify(data))
        // code to store success goes here:
        subscriber.brevoSuccess = new Date()
        await prisma.newsletterSubscription.update({
          where: {
            id: subscriber.id,
          },
          data: {
            ...subscriber,
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
}
