import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import i18n from '#plugins/i18n'

import LanguageSelector from './LanguageSelector.vue'

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

  describe('switch locale with existing locale', () => {
    beforeEach(async () => {
      await vSelect.setValue('en')
    })

    it('change locale', () => {
      expect(i18n.global.locale.value).toBe('en')
    })
  })
})
