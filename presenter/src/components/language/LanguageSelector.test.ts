import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import LanguageSelector from './LanguageSelector.vue'

const locationHrefSetSpy = vi.spyOn(window.location, 'href', 'set')

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
      expect(locationHrefSetSpy).toHaveBeenCalledWith('/en/some-url')
    })
  })
})
