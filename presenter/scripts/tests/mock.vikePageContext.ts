import { config } from '@vue/test-utils'

import { vikePageContext } from '#context/usePageContext'

config.global.provide = {
  ...config.global.provide,
  [vikePageContext as symbol]: {
    urlPathname: '/some-url',
    urlOriginal: '/original-url',
    routeParams: {
      code: 'my-code',
    },
    locale: 'de',
  },
}
