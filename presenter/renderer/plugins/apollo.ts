import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { createHttpLink } from '@apollo/client/link/http'
// import { onError } from '@apollo/client/link/error'
import { User } from 'oidc-client-ts'

import { ENDPOINTS } from '#src/env'

const authLink = setContext((_, { headers }) => {
  let token = ''
  const auth = localStorage.getItem('auth')
  if (auth) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed = JSON.parse(auth)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (parsed.user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      const user: User = parsed.user
      token = user.access_token ? user.access_token : ''
    }
  }
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

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

export const apolloClient = new ApolloClient({
  ssrMode: true,
  link: authLink.concat(httpLink), // errorLink.concat(httpLink),
  cache,
})
