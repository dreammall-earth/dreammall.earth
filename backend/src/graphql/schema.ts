import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

import { ContactFormResolver } from './resolvers/ContactFormResolver'
import { NewsletterSubscriptionResolver } from './resolvers/NewsletterSubscriptionResolver'

export const schema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [ContactFormResolver, NewsletterSubscriptionResolver],
    validate: {
      validationError: { target: false },
      skipMissingProperties: true,
      skipNullProperties: true,
      skipUndefinedProperties: false,
      forbidUnknownValues: true,
      stopAtFirstError: true,
    },
  })
}
