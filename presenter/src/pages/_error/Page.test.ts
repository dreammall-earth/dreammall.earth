import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import ErrorPage from './+Page.vue'
import { title } from './+title'

describe('ErrorPage', () => {
  const Wrapper = () => {
    return mount(ErrorPage)
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('title returns correct title', () => {
    expect(title).toBe('DreamMall | Fehler')
  })

  describe('no is404 property set', () => {
    it('renders error 500', () => {
      expect(wrapper.find('h1').text()).toEqual("$t('error.500.h1')")
      expect(wrapper.find('p').text()).toEqual("$t('error.500.text')")
    })
  })

  describe('is404 property is false', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        is404: false,
      })
    })

    it('renders error 500', () => {
      expect(wrapper.find('h1').text()).toEqual("$t('error.500.h1')")
      expect(wrapper.find('p').text()).toEqual("$t('error.500.text')")
    })
  })

  describe('is404 property is true', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        is404: true,
      })
    })

    it('renders error 400', () => {
      expect(wrapper.find('h1').text()).toEqual("$t('error.404.h1')")
      expect(wrapper.find('p').text()).toEqual("$t('error.404.text')")
    })
  })
})
