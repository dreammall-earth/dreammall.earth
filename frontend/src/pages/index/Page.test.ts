import { ApolloError } from '@apollo/client/errors'
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

// eslint-disable-next-line import/no-relative-parent-imports
import { getRoom } from '#queries/getRoom'
import { mockClient } from '#tests/mock.apolloClient'

import IndexPage from './+Page.vue'
import { title } from './+title'

const getRoomMock = vi.fn()

mockClient.setRequestHandler(
  getRoom,
  getRoomMock.mockResolvedValue({ data: { getRoom: 'http://some.url' } }),
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

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = Wrapper()
  })

  it('title returns default title', () => {
    expect(title()).toBe('DreamMall')
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('room button', () => {
    const consoleSpy = vi.spyOn(global.console, 'log')

    describe('without error', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        await wrapper.find('button.room-button').trigger('click')
      })

      it('calls the API', () => {
        expect(getRoomMock).toBeCalled()
      })

      it('logs message', () => {
        expect(consoleSpy).toBeCalledWith('Redirect to http://some.url')
      })
    })

    describe.skip('with error', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        getRoomMock.mockRejectedValue(new ApolloError('Aua!'))
        await wrapper.find('button.room-button').trigger('click')
      })

      it('logs error message', () => {
        expect(consoleSpy).toBeCalledWith('auth error', new ApolloError('Aua!'))
      })
    })
  })
})
