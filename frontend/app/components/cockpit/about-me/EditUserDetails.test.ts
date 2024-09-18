import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { UserDetail } from '#app/stores/userStore'

import EditUserDetails from './EditUserDetails.vue'

describe('EditUserDetails', () => {
  const Wrapper = (
    details = [
      {
        id: 1,
        category: 'education',
        text: 'I am a student',
      },
      {
        id: 2,
        category: 'work',
        text: 'I am a worker',
      },
      {
        id: 3,
        category: 'work',
        text: 'I really like my job',
      },
      {
        id: 4,
        category: 'language',
        text: 'English',
      },
      {
        id: 5,
        category: 'place',
        text: 'Berlin',
      },
      {
        id: 6,
        category: 'feeling',
        text: 'Yeah!',
      },
    ] as UserDetail[],
  ) =>
    mount(VApp, {
      slots: {
        default: h(EditUserDetails as Component, {
          details,
        }),
      },
    })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })
})
