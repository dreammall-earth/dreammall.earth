import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createHttpLink } from '@apollo/client/link/http'

import type { PageContext } from 'vike/types'

export const createApolloClient = (ENDPOINTS: PageContext['publicEnv']['ENDPOINTS']) => {
  const httpLink = createHttpLink({
    uri: ENDPOINTS.GRAPHQL_URI,
  })
  const cache = new InMemoryCache()
  return new ApolloClient({
    ssrMode: true,
    link: httpLink, // errorLink.concat(httpLink),
    cache,
  })
}
