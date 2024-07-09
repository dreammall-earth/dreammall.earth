import { DefaultApolloClient } from '@vue/apollo-composable'
import { config } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { vi } from 'vitest'

import { openRoomsQuery } from '#src/graphql/queries/openRoomsQuery'
import { updateOpenRoomsSubscription } from '#subscriptions/updateOpenRoomsSubscription'

export const mockClient = createMockClient()

export const openRoomsQueryMock = vi.fn()

export const updateOpenRoomsSubscriptionMock: IMockSubscription = createMockSubscription()

mockClient.setRequestHandler(
  openRoomsQuery,
  openRoomsQueryMock.mockResolvedValue({ data: { openRooms: [] } }),
)

mockClient.setRequestHandler(updateOpenRoomsSubscription, () => updateOpenRoomsSubscriptionMock)

config.global.provide = {
  ...config.global.provide,
  [DefaultApolloClient]: mockClient,
}
