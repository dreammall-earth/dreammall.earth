/* eslint-disable vitest/prefer-to-be */

import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { vikePageContext } from '#context/usePageContext'
import i18n from '#plugins/i18n'

import ErrorPage from './+Page.vue'
import { title } from './+title'

const global = {
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
}

describe('ErrorPage', () => {
  it('title returns correct title', () => {
    expect(title()).toBe(i18n.global.t('error.title'))
  })
  describe('500 Error', () => {
    const WrapperUndefined = () => {
      return mount(VApp, {
        global,
        slots: {
          default: h(ErrorPage as Component),
        },
      })
    }
    const WrapperFalse = () => {
      return mount(VApp, {
        global,
        slots: {
          default: h(ErrorPage as Component, {
            is404: false,
          }),
        },
      })
    }

    let wrapper: ReturnType<typeof WrapperUndefined>
    beforeEach(() => {
      wrapper = WrapperUndefined()
    })
    describe('no is404 property set', () => {
      it('renders error 500', () => {
        expect(wrapper.find('h1').text()).toEqual("$t('error.500.h1')")
        expect(wrapper.find('p').text()).toEqual("$t('error.500.text')")
      })
    })

    describe('is404 property is false', () => {
      beforeEach(() => {
        wrapper = WrapperFalse()
      })

      it('renders error 500', () => {
        expect(wrapper.find('h1').text()).toEqual("$t('error.500.h1')")
        expect(wrapper.find('p').text()).toEqual("$t('error.500.text')")
      })
    })
  })
  describe('404 Error', () => {
    const Wrapper = () => {
      return mount(VApp, {
        global,
        slots: {
          default: h(ErrorPage as Component, {
            is404: true,
          }),
        },
      })
    }
    let wrapper: ReturnType<typeof Wrapper>
    beforeEach(() => {
      wrapper = Wrapper()
    })
    describe('is404 property is true', () => {
      it('renders error 400', () => {
        expect(wrapper.find('h1').text()).toEqual("$t('error.404.h1')")
        expect(wrapper.find('p').text()).toEqual("$t('error.404.text')")
      })
    })
  })
})
