import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { split } from '@apollo/client/link/core'
import { onError } from '@apollo/client/link/error'
import { createHttpLink } from '@apollo/client/link/http'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { navigate } from 'vike/client/router'
import { WebSocket } from 'ws'

import type { PageContext } from 'vike/types'

export const createApolloClient = (dependencies: {
  endpoints: PageContext['publicEnv']['ENDPOINTS']
  getToken: () => string
  isClient: boolean
  pageContext: PageContext
}) => {
  const { endpoints, getToken, isClient, pageContext } = dependencies
  const cache = new InMemoryCache()

  const authLink = setContext((_, { headers }) => {
    const token = getToken()
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    }
  })

  const httpLink = createHttpLink({
    uri: endpoints.GRAPHQL_URI,
  })

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ extensions }) => {
        if (extensions !== null && extensions?.code === 'UNAUTHENTICATED') {
          void navigate(`/signin?previousUrl=${encodeURIComponent(pageContext.urlPathname)}`)
        }
      })
    }
  })

  if (!isClient) {
    return new ApolloClient({
      ssrMode: true,
      link: authLink.concat(errorLink).concat(httpLink),
      cache,
    })
  }

  const wsLink = new GraphQLWsLink(
    createClient({
      webSocketImpl: WebSocket,
      url: endpoints.WEBSOCKET_URI,
      connectionParams: () => {
        return {
          token: getToken(),
        }
      },
    }),
  )

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink,
  )

  return new ApolloClient({
    ssrForceFetchDelay: 100,
    link: authLink.concat(errorLink).concat(splitLink),
    cache,
  })
}
