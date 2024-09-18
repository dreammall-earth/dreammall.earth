import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { vikePageContext } from '#renderer/context/usePageContext'

import LanguageSelector from './LanguageSelector.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('LanguageSelector', () => {
  const Wrapper = () => {
    return mount(LanguageSelector, {
      global: {
        provide: {
          [vikePageContext as symbol]: {
            urlPathname: '/some-url',
            urlOriginal: '/original-url',
          },
        },
      },
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
