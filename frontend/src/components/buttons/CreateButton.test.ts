import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import CreateButton from './CreateButton.vue'

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
    beforeEach(() => {
      wrapper = Wrapper()
    })
    describe('enter room', () => {
      beforeEach(async () => {
        await wrapper.find('#create-button').trigger('click')
        await wrapper.find('button.new-table-button').trigger('click')
      })

      it.skip('opens url in new tab', () => {
        expect(navigate).toBeCalledWith('/room/')
      })
    })
  })
})
