import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import { config } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'

export const setupMockClient = () => {
  const mockClient = createMockClient()

  config.global.provide = {
    ...config.global.provide,
    [DefaultApolloClient]: mockClient,
  }

  provideApolloClient(mockClient)

  return mockClient
}
