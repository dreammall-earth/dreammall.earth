import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import CreateButtonMobile from './CreateButtonMobile.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('CreateButton', () => {
  const Wrapper = () => {
    return mount(CreateButtonMobile, {
      props: {},
      global: {
        stubs: {
          teleport: true,
        },
      },
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
    expect(wrapper.find('.button-list-mobile').classes('button-list-mobile--active')).toBeFalsy()
    expect(wrapper.find('svg g.outer-rings').classes('outer-rings--active')).toBeFalsy()
    expect(wrapper.find('svg g.most-outer-rings').classes('most-outer-rings--active')).toBeFalsy()
  })

  describe('click on create button', () => {
    it('emits click event', async () => {
      await wrapper.find('#create-button-mobile').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('click', [[1]])
    })

    it('button list visible', async () => {
      await wrapper.find('#create-button-mobile').trigger('click')
      expect(wrapper.find('.button-list-mobile').classes('button-list-mobile--active')).toBeTruthy()
      expect(wrapper.find('svg g.outer-rings').classes('outer-rings--active')).toBeTruthy()
      expect(
        wrapper.find('svg g.most-outer-rings').classes('most-outer-rings--active'),
      ).toBeTruthy()
    })
  })

  describe('new table button', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })
    describe('enter room', () => {
      beforeEach(async () => {
        await wrapper.find('#create-button-mobile').trigger('click')
        await wrapper.find('.button-list-mobile button.new-table-button').trigger('click')
      })

      it('opens room page', () => {
        expect(navigate).toHaveBeenCalledWith('/room/')
      })
    })
  })
})
