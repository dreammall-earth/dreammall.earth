import { DefaultApolloClient } from '@vue/apollo-composable'
import { config } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'

export const mockClient = createMockClient()

config.global.provide = {
  ...config.global.provide,
  [DefaultApolloClient]: mockClient,
}
