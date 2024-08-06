import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

import { CONFIG } from '#config/config'
import { authChecker } from '#src/auth/authChecker'

import { pubSub } from './pubSub'
import { ContactFormResolver } from './resolvers/ContactFormResolver'
import { checkForOpenTables } from './resolvers/dal/handleOpenTables'
import { NewsletterSubscriptionResolver } from './resolvers/NewsletterSubscriptionResolver'
import { TableResolver } from './resolvers/TableResolver'
import { UserResolver } from './resolvers/UserResolver'

if (CONFIG.BBB_PULL_MEETINGS) void checkForOpenTables()

export const schema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [ContactFormResolver, NewsletterSubscriptionResolver, TableResolver, UserResolver],
    pubSub,
    validate: {
      validationError: { target: false },
      skipMissingProperties: true,
      skipNullProperties: true,
      skipUndefinedProperties: false,
      forbidUnknownValues: true,
      stopAtFirstError: true,
    },
    authChecker,
  })
}
