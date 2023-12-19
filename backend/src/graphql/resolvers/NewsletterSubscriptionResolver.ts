import { Resolver, Mutation, Arg } from 'type-graphql'

import { sendContactToBrevo } from '#api/NewsletterBrevo'
import { SubscribeToNewsletterInput } from '#inputs/SubscribeToNewsletterInput'
import { prisma } from '#src/prisma'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Arg('subscribeToNewsletterData') subscribeToNewsletterData: SubscribeToNewsletterInput,
  ): Promise<boolean> {
    const subscriber = await prisma.newsletterSubscription.create({
      data: subscribeToNewsletterData,
    })
    const promise = sendContactToBrevo(subscriber)
    if (promise) {
      void promise.then(() => {
        // console.log('API called successfully. Returned data: ', JSON.stringify(data))
        // code to store success goes here:
        subscriber.brevoSuccess = new Date()
        void prisma.newsletterSubscription.update({
          where: {
            id: subscriber.id,
          },
          data: {
            ...subscriber,
          },
        })
        return undefined
      })
    }
    return true
  }
}
