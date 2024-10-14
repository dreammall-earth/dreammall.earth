import { AuthenticationError } from 'type-graphql'

import type { Context } from '#src/context'
import type {
  ApolloServerPlugin,
  GraphQLRequestListener,
  GraphQLRequestContextDidEncounterErrors,
} from '@apollo/server'
import type { NodeOptions, withScope, captureException } from '@sentry/node'

type Sentry = {
  captureException: typeof captureException
  withScope: typeof withScope
}

export const createApolloPlugin: (
  sentryOptions: NodeOptions,
  sentry: Sentry,
) => ApolloServerPlugin<Context> = ({ dsn }, sentry) => {
  if (!dsn) {
    return {}
  }
  return {
    requestDidStart() {
      // eslint-disable-next-line @typescript-eslint/require-await
      const didEncounterErrors = async (ctx: GraphQLRequestContextDidEncounterErrors<Context>) => {
        const { operation } = ctx
        if (!operation) {
          return
        }
        for (const err of ctx.errors) {
          if (err.extensions?.code === 'UNAUTHENTICATED') {
            return
          }
          if (err instanceof AuthenticationError) {
            return
          }
          sentry.withScope((scope) => {
            // Annotate whether failing operation was query/mutation/subscription
            scope.setTag('kind', operation.operation)
            // Log query and variables as extras
            // (make sure to strip out sensitive data!)
            scope.setExtra('query', ctx.request.query)
            scope.setExtra('variables', ctx.request.variables)
            if (err.path) {
              // We can also add the path as breadcrumb
              scope.addBreadcrumb({
                category: 'query-path',
                message: err.path.join(' > '),
                level: 'debug',
              })
            }
            sentry.captureException(err)
          })
        }
      }
      const graphQLRequestListener: GraphQLRequestListener<Context> = { didEncounterErrors }
      return Promise.resolve(graphQLRequestListener)
    },
  }
}
