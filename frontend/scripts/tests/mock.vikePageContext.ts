import { config } from '@vue/test-utils'

import { vikePageContext } from '#context/usePageContext'

export type MockPageContext = {
  urlPathname: string
  routeParams?: {
    id?: string | number
  }
}

export const setMockPageContext = (mockPageContext: MockPageContext) => {
  config.global.provide = {
    ...config.global.provide,
    [vikePageContext as symbol]: mockPageContext,
  }
}
