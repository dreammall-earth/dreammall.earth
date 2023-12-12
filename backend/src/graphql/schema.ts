import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

import { ContactFormResolver } from './resolvers/ContactFormResolver'

export const schema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [ContactFormResolver],
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
