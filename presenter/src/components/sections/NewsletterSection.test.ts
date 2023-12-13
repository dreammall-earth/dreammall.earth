import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { ComponentPublicInstance } from 'vue'

import NewsletterSection from './NewsletterSection.vue'

describe('NewsletterSection', () => {
  let wrapper: VueWrapper<unknown, ComponentPublicInstance<unknown, Omit<unknown, never>>>
  const Wrapper = () => {
    return mount(NewsletterSection)
  }

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.find('.newsletter-section').exists()).toBeTruthy()
  })
})
