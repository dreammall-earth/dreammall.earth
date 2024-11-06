import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import SidebarInfo from './SidebarInfo.vue'

import type { UserWithProfile } from '#stores/userStore'

const profile: UserWithProfile = {
  id: 1,
  username: 'mockedUser',
  name: 'User',
  introduction: 'Hello, I am a mocked user',
  availability: 'available',
  details: [
    {
      id: 1,
      category: 'education',
      text: 'mockedText',
    },
  ],
  social: [
    {
      id: 1,
      type: 'discord',
      link: 'mockedLink',
    },
  ],
}

describe('SidebarInfo', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(SidebarInfo as Component, { profile }),
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
