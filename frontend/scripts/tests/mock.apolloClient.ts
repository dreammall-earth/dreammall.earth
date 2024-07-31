import { DefaultApolloClient } from '@vue/apollo-composable'
import { config } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { vi } from 'vitest'

import { openTablesQuery } from '#src/graphql/queries/openTablesQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

export const mockClient = createMockClient()

export const openTablesQueryMock = vi.fn()

export const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()

mockClient.setRequestHandler(
  openTablesQuery,
  openTablesQueryMock.mockResolvedValue({ data: { openTables: [] } }),
)

mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)

config.global.provide = {
  ...config.global.provide,
  [DefaultApolloClient]: mockClient,
}
