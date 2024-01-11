import { Resolver, Mutation, Arg } from 'type-graphql'

import { subscribeToNewsletter } from '#api/Brevo'
import { SubscribeToNewsletterInput } from '#inputs/SubscribeToNewsletterInput'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Arg('subscribeToNewsletterData') subscribeToNewsletterData: SubscribeToNewsletterInput,
  ): Promise<boolean> {
    return subscribeToNewsletter(
      subscribeToNewsletterData.firstName,
      subscribeToNewsletterData.lastName,
      subscribeToNewsletterData.email,
    )
  }
}
