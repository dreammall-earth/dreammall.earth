import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { vikePageContext } from '#context/usePageContext'
import i18n from '#plugins/i18n'

import ImpressumPage from './+Page.vue'
import { title } from './+title'

describe('ImpressumPage', () => {
  const wrapper = mount(VApp, {
    global: {
      provide: {
        [vikePageContext as symbol]: {
          publicEnv: {
            AUTH: {
              SIGNIN_URI: '',
              SIGNUP_URI: '',
            },
          },
        },
      },
    },
    slots: {
      default: h(ImpressumPage as Component),
    },
  })

  it('title returns correct title', () => {
    expect(title()).toBe(i18n.global.t('impress.title'))
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
