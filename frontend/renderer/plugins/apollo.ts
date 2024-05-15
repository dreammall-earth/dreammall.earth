import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { createHttpLink } from '@apollo/client/link/http'
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

const httpLink = createHttpLink({
  uri: ENDPOINTS.GRAPHQL_URI,
})

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
    link: createAuthLink(getToken).concat(httpLink), // errorLink.concat(httpLink),
    cache,
  })
}
