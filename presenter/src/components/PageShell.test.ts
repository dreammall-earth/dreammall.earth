import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import TopMenu from '#components/menu/TopMenu.vue'
import { setupIntersectionObserverMock } from '#root/scripts/tests/mock.IntersectionObserver'

import PageShell from './PageShell.vue'

setupIntersectionObserverMock()

describe('PageShell', () => {
  const wrapper = mount(PageShell, {
    slots: {
      default: 'Page Content',
    },
  })

  it('renders page content', () => {
    expect(wrapper.find('.v-application').exists()).toBeTruthy()
    expect(wrapper.find('.v-application').findComponent(TopMenu)).toBeTruthy()
    expect(wrapper.html()).toContain('Page Content')
  })
})
