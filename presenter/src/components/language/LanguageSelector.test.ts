import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import LanguageSelector from './LanguageSelector.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('LanguageSelector', () => {
  const Wrapper = () => {
    return mount(LanguageSelector, {
      props: {},
    })
  }
  let wrapper: ReturnType<typeof Wrapper>
  let vSelect: ReturnType<typeof wrapper.findComponent>

  beforeEach(() => {
    wrapper = Wrapper()
    vSelect = wrapper.findComponent({ name: 'v-select' })
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('switch locale', () => {
    beforeEach(async () => {
      await vSelect.setValue('en')
    })

    it('to en', () => {
      expect(navigate).toHaveBeenCalledWith('/en/original-url')
    })
  })
})
