import { config } from '@vue/test-utils'
import { reactive } from 'vue'

import { vikePageContext } from '#renderer/context/usePageContext'

type MockPageContext = {
  urlPathname: string
  routeParams?: {
    id?: string | number
  }
}

export const mockPageContext: MockPageContext = reactive({
  urlPathname: '/some-url',
})

config.global.provide = {
  ...config.global.provide,
  [vikePageContext as symbol]: mockPageContext,
}
