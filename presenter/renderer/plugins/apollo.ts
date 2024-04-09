import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createHttpLink } from '@apollo/client/link/http'
// import { onError } from '@apollo/client/link/error'

import { ENDPOINTS } from '#src/env'

const httpLink = createHttpLink({
  uri: ENDPOINTS.GRAPHQL_URI,
})

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

const cache = new InMemoryCache()

export const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: true,
    link: httpLink, // errorLink.concat(httpLink),
    cache,
  })
}
