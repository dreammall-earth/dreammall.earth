import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import { setupIntersectionObserverMock } from '#root/scripts/tests/mock.IntersectionObserver'

import SecondSection from './SecondSection.vue'

setupIntersectionObserverMock()

describe('SecondSection', () => {
  const wrapper = mount(SecondSection)

  it('renders SecondSection', () => {
    expect(wrapper.find('.section2').exists()).toBeTruthy()
  })
})
