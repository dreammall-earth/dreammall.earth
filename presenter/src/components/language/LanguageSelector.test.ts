import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest'

import LanguageSelector from './LanguageSelector.vue'

const { location } = window

const setHrefSpy = vi.fn((href: string) => href)

describe('LanguageSelector', () => {
  const Wrapper = () => {
    return mount(LanguageSelector, {
      props: {},
    })
  }
  let wrapper: ReturnType<typeof Wrapper>
  let vSelect: ReturnType<typeof wrapper.findComponent>

  beforeAll(() => {
    window.location = {} as Location
    Object.defineProperty(window.location, 'href', {
      get: vi.fn(),
      set: setHrefSpy,
    })
  })

  afterAll(() => {
    window.location = location
  })

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
      expect(setHrefSpy).toHaveBeenCalledWith('/en/some-url')
    })
  })
})
