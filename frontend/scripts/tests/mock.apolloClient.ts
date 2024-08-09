import { DefaultApolloClient } from '@vue/apollo-composable'
import { config } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { vi } from 'vitest'

import { addSocialMediaMutation } from '#mutations/addSocialMediaMutation'
import { addUserDetailMutation } from '#mutations/addUserDetailMutation'
import { removeSocialMediaMutation } from '#mutations/removeSocialMediaMutation.js'
import { removeUserDetailMutation } from '#mutations/removeUserDetailMutation.js'
import { updateUserMutation } from '#mutations/updateUserMutation'
import { currentUserQuery } from '#queries/currentUserQuery'
import { openTablesQuery } from '#src/graphql/queries/openTablesQuery'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

export const mockClient = createMockClient()

export const openTablesQueryMock = vi.fn()

export const currentUserQueryMock = vi.fn()

export const addUserDetailMock = vi.fn()

export const addSocialMediaMock = vi.fn()

export const removeUserDetailMock = vi.fn()

export const removeSocialMediaMock = vi.fn()

export const updateUserMutationMock = vi.fn()

export const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()

mockClient.setRequestHandler(
  openTablesQuery,
  openTablesQueryMock.mockResolvedValue({ data: { openTables: [] } }),
)

mockClient.setRequestHandler(
  currentUserQuery,
  currentUserQueryMock.mockResolvedValue({
    data: {
      currentUser: {
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        table: null,
        availability: null,
        introduction: '',
        details: [],
        social: [],
      },
    },
  }),
)

mockClient.setRequestHandler(updateUserMutation, updateUserMutationMock)

mockClient.setRequestHandler(addUserDetailMutation, addUserDetailMock)

mockClient.setRequestHandler(addSocialMediaMutation, addSocialMediaMock)

mockClient.setRequestHandler(removeUserDetailMutation, removeUserDetailMock.mockResolvedValue([]))

mockClient.setRequestHandler(removeSocialMediaMutation, removeUserDetailMock.mockResolvedValue([]))

mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)

config.global.provide = {
  ...config.global.provide,
  [DefaultApolloClient]: mockClient,
}
