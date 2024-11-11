import { provideApolloClient } from '@vue/apollo-composable'
import { mount } from '@vue/test-utils'
import { createMockClient } from 'mock-apollo-client'
import { vi, describe, expect, it } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { currentUserQuery } from '#queries/currentUserQuery'
import { UserDetail } from '#stores/userStore'

import EditUserDetails from './EditUserDetails.vue'

const currentUserQueryMock = vi.fn()

const mockClient = createMockClient()

mockClient.setRequestHandler(
  currentUserQuery,
  currentUserQueryMock.mockResolvedValue({
    data: {
      currentUser: {
        id: 666,
        name: 'Current User',
        username: 'currentUser',
        availability: 'available',
        introduction: 'Hello, I am the current user',
        details: [
          { id: 1, category: 'education', text: 'I am a student' },
          { id: 2, category: 'work', text: 'I am a worker' },
          { id: 3, category: 'work', text: 'I really like my job' },
          { id: 4, category: 'language', text: 'English' },
          { id: 5, category: 'place', text: 'Berlin' },
          { id: 6, category: 'feeling', text: 'Yeah!' },
        ] as UserDetail[],
        social: [],
      },
    },
  }),
)

provideApolloClient(mockClient)

describe('EditUserDetails', () => {
  const Wrapper = (
    details = [
      {
        id: 1,
        category: 'education',
        text: 'I am a student',
      },
      {
        id: 2,
        category: 'work',
        text: 'I am a worker',
      },
      {
        id: 3,
        category: 'work',
        text: 'I really like my job',
      },
      {
        id: 4,
        category: 'language',
        text: 'English',
      },
      {
        id: 5,
        category: 'place',
        text: 'Berlin',
      },
      {
        id: 6,
        category: 'feeling',
        text: 'Yeah!',
      },
    ] as UserDetail[],
  ) =>
    mount(VApp, {
      slots: {
        default: h(EditUserDetails as Component, {
          details,
        }),
      },
    })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })
})
