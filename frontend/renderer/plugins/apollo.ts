import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { split } from '@apollo/client/link/core'
import { createHttpLink } from '@apollo/client/link/http'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { WebSocket } from 'ws'

// import { onError } from '@apollo/client/link/error'

import { ENDPOINTS } from '#src/env'

const createAuthLink = (getToken: () => string) => {
  return setContext((_, { headers }) => {
    const token = getToken()
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    }
  })
}

const wsLink = new GraphQLWsLink(
  createClient({
    webSocketImpl: WebSocket,
    url: ENDPOINTS.WEBSOCKET_URI,
  }),
)

const httpLink = createHttpLink({
  uri: ENDPOINTS.GRAPHQL_URI,
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const cache = new InMemoryCache()

/*
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})
*/

export const createApolloClient = (getToken: () => string, isClient: boolean) => {
  return new ApolloClient({
    ...(isClient ? { ssrForceFetchDelay: 100 } : { ssrMode: true }),
    link: createAuthLink(getToken).concat(isClient ? splitLink : httpLink), // errorLink.concat(httpLink),
    cache,
  })
}
