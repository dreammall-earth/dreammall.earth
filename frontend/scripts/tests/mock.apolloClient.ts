import { DefaultApolloClient } from '@vue/apollo-composable'
import { config } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { vi } from 'vitest'

import { openRoomsQuery } from '#src/graphql/queries/openRoomsQuery'

export const mockClient = createMockClient()

export const openRoomsQueryMock = vi.fn()

mockClient.setRequestHandler(
  openRoomsQuery,
  openRoomsQueryMock.mockResolvedValue({ data: { openRooms: [] } }),
)

config.global.provide = {
  ...config.global.provide,
  [DefaultApolloClient]: mockClient,
}
