import { config } from '@vue/test-utils'

import { vikePageContext } from '#context/usePageContext'

type MockPageContext = {
  urlPathname: string
  routeParams?: {
    id?: string | number
  }
}

export const mockPageContext: MockPageContext = {
  urlPathname: '/some-url',
}

config.global.provide = {
  ...config.global.provide,
  [vikePageContext as symbol]: mockPageContext,
}
