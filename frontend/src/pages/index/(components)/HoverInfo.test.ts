import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import HoverInfo from './HoverInfo.vue'

import type { UserWithProfile } from '#stores/userStore'

describe('HoverInfo', () => {
  const Wrapper = (
    props = {
      data: {
        id: 1,
        name: 'Marianne Müller',
        username: 'username',
        availability: 'available' as const,
        details: [],
        social: [],
      } as UserWithProfile | null,
      x: 100,
      y: 200,
      showMoreButton: true,
    },
  ) => {
    return mount(HoverInfo, {
      props,
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders without Show More button', () => {
    wrapper = Wrapper({
      data: {
        id: 1,
        name: 'Marianne Müller',
        username: 'username',
        availability: 'available' as const,
        details: [],
        social: [],
      },
      x: 100,
      y: 200,
      showMoreButton: false,
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders without star data', () => {
    wrapper = Wrapper({
      data: null,
      x: 100,
      y: 200,
      showMoreButton: false,
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('show more button', () => {
    it('emits show-more event', async () => {
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('show-more')).toBeTruthy()
    })
  })
})
