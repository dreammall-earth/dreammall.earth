import { mount, config } from '@vue/test-utils'
import { beforeEach, expect, describe, it } from 'vitest'
import { Component, h, reactive } from 'vue'
import { VApp } from 'vuetify/components'

import { vikePageContext } from '#renderer/context/usePageContext'

import DefaultLayout from './DefaultLayout.vue'

const mockPageContext = reactive({
  publicEnv: {
    AUTH: {
      SIGNIN_URI: '',
      SIGNUP_URI: '',
    },
  },
})

config.global.provide = {
  ...config.global.provide,
  [vikePageContext as symbol]: mockPageContext,
}

describe('DefaultLayout', () => {
  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(DefaultLayout as Component),
      },
    })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
