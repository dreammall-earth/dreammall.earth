import { config } from '@vue/test-utils'

import AuthService from '#src/services/AuthService'

export const authService = new AuthService()

config.global.provide = {
  ...config.global.provide,
  authService,
}
