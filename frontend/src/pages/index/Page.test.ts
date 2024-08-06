import { mount } from '@vue/test-utils'
import { gql } from 'graphql-tag'
import { createMockSubscription, IMockSubscription } from 'mock-apollo-client'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { mockClient } from '#tests/mock.apolloClient'

import IndexPage from './+Page.vue'
import { title } from './+title'

const mockSubscription: IMockSubscription = createMockSubscription()

mockClient.setRequestHandler(
  gql`
    subscription {
      updateOpenTables
    }
  `,
  () => mockSubscription,
)

describe('IndexPage', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(IndexPage as Component),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  describe('without apollo error', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })

    it('title returns default title', () => {
      expect(title()).toBe('DreamMall')
    })

    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
