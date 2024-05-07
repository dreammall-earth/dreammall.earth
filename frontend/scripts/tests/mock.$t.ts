import { config } from '@vue/test-utils'

config.global.stubs.transition = false

config.global.mocks = {
  ...config.global.mocks,
  $t: (tKey: string) => "$t('" + tKey + "')", // just return translation key
}
