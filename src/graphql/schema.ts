import path from 'path'

import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

import { HelloResolver } from './resolvers/HelloResolver'

export const schema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [HelloResolver],
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
