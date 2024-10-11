import { Resolver, Mutation, Ctx, Arg } from 'type-graphql'

import { SubscribeToNewsletterInput } from '#inputs/SubscribeToNewsletterInput'
import { EVENT_NEWSLETTER_CONFIRM, EVENT_NEWSLETTER_SUBSCRIBE } from '#src/event/Events'

import type { Context } from '#src/context'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Arg('subscribeToNewsletterData') subscribeToNewsletterData: SubscribeToNewsletterInput,
    @Ctx() context: Context,
  ): Promise<boolean> {
    const { brevo } = context
    const result = await brevo.subscribeToNewsletter(
      subscribeToNewsletterData.firstName,
      subscribeToNewsletterData.lastName,
      subscribeToNewsletterData.email,
    )
    await EVENT_NEWSLETTER_SUBSCRIBE(subscribeToNewsletterData.email)
    return result
  }

  @Mutation(() => Boolean)
  async confirmNewsletter(@Arg('code') code: string, @Ctx() context: Context): Promise<boolean> {
    const { brevo } = context
    const result = await brevo.confirmNewsletter(code)
    await EVENT_NEWSLETTER_CONFIRM(result ? result.email : undefined)
    return !!result
  }
}
