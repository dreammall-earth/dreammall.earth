import { createTestingPinia } from '@pinia/testing'
import { config } from '@vue/test-utils'

import { vikePageContext } from '#context/usePageContext'
import i18n from '#plugins/i18n'
import vuetify from '#plugins/vuetify'
import { authService } from '#src/tests/mock.authService.js'
import { mockPageContext } from '#tests/mock.vikePageContext'

config.global.plugins.push(i18n)
config.global.plugins.push(vuetify(i18n))
config.global.plugins.push(createTestingPinia({ stubActions: false }))

config.global.provide = {
  ...config.global.provide,
  authService,
  [vikePageContext as symbol]: mockPageContext,
}

config.global.mocks = {
  ...config.global.mocks,
  i18n$t: i18n.global.t,
  i18n$d: i18n.global.d,
  i18n$n: i18n.global.n,
  $t: (tKey: string) => `$t('${tKey}')`,
}
