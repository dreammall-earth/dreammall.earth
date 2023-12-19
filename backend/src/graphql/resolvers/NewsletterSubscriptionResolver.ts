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
    void sendContactToBrevo(subscriber)
    return true
  }
}
