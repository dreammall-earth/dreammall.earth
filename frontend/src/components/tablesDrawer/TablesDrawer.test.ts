import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { createMockClient, createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { tablesQuery } from '#queries/tablesQuery.js'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

import TablesDrawer from './TablesDrawer.vue'

export const mockClient = createMockClient()

const tablesQueryMock = vi.fn()
const updateOpenTablesSubscriptionMock: IMockSubscription = createMockSubscription()

mockClient.setRequestHandler(
  tablesQuery,
  tablesQueryMock.mockResolvedValue({ data: { tables: [] } }),
)
mockClient.setRequestHandler(updateOpenTablesSubscription, () => updateOpenTablesSubscriptionMock)

provideApolloClient(mockClient)

describe('TablesDrawer', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TablesDrawer as Component, { drawer: true }),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
