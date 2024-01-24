import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import { setupIntersectionObserverMock } from '#root/scripts/tests/mock.IntersectionObserver'

import AboutSection from './AboutSection.vue'

setupIntersectionObserverMock()

describe('AboutSection', () => {
  const wrapper = mount(AboutSection)

  it('renders AboutSection', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
