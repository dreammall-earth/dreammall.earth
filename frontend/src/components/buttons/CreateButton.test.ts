import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'
import { mockClient } from '#tests/mock.apolloClient'

import CreateButton from './CreateButton.vue'

const joinMyRoomQueryMock = vi.fn()

mockClient.setRequestHandler(
  joinMyRoomQuery,
  joinMyRoomQueryMock.mockResolvedValue({ data: { joinMyRoom: 'http://some.url' } }),
)

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('CreateButton', () => {
  const Wrapper = () => {
    return mount(CreateButton, {
      props: {},
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('button list content is hidden', () => {
    expect(wrapper.find('.new-project-button').exists()).toBe(false)
    expect(wrapper.find('.new-table-button').exists()).toBe(false)
    expect(wrapper.find('.assistent-button').exists()).toBe(false)
  })

  describe('click on create button', () => {
    it('emits click event', async () => {
      await wrapper.find('#create-button').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('click', [[1]])
    })

    it('button list visible', async () => {
      await wrapper.find('#create-button').trigger('click')
      expect(wrapper.find('.new-project-button').exists()).toBe(true)
      expect(wrapper.find('.new-table-button').exists()).toBe(true)
      expect(wrapper.find('.assistant-button').exists()).toBe(true)
    })
  })

  describe('new table button', () => {
    describe('without apollo error', () => {
      beforeEach(() => {
        joinMyRoomQueryMock.mockResolvedValue({ data: { getRoom: 'http://some.url' } })
        wrapper = Wrapper()
      })
      describe('enter room', () => {
        // const consoleSpy = vi.spyOn(global.console, 'log')
        const windowOpenSpy = vi.spyOn(window, 'open')

        beforeEach(async () => {
          await wrapper.find('#create-button').trigger('click')
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('calls the API', () => {
          expect(joinMyRoomQueryMock).toBeCalled()
        })

        it.skip('opens url in new tab', () => {
          expect(windowOpenSpy).toBeCalledWith('http://some.url/', '_blank')
        })
      })
    })

    describe.skip('with apollo error', () => {
      beforeEach(async () => {
        wrapper.unmount()
        vi.clearAllMocks()
        joinMyRoomQueryMock.mockRejectedValue({ message: 'Aua!', data: undefined })
        wrapper = Wrapper()
        await wrapper.find('#create-button').trigger('click')
      })

      describe('enter room', () => {
        const consoleSpy = vi.spyOn(global.console, 'log')

        beforeEach(async () => {
          await wrapper.find('button.new-table-button').trigger('click')
        })

        it('logs error message', () => {
          expect(consoleSpy).toBeCalledWith('Aua!')
        })
      })
    })
  })
})
