import { printConfigError } from './printConfigError'

import type { CONFIG } from '#config/config'
import type { Logger } from '#src/logger'

export const CONFIG_CHECKS = {
  CONFIG_CHECK_BREVO_SEND_CONTACT: (
    config: typeof CONFIG,
  ): config is typeof CONFIG & {
    BREVO_KEY: string
    BREVO_CONTACT_TEMPLATE_ADMIN: number
    BREVO_CONTACT_TEMPLATE_USER: number
    BREVO_ADMIN_NAME: string
    BREVO_ADMIN_EMAIL: string
  } =>
    typeof config.BREVO_KEY === 'string' &&
    typeof config.BREVO_CONTACT_TEMPLATE_ADMIN === 'number' &&
    typeof config.BREVO_CONTACT_TEMPLATE_USER === 'number' &&
    typeof config.BREVO_ADMIN_NAME === 'string' &&
    typeof config.BREVO_ADMIN_EMAIL === 'string',
  CONFIG_CHECK_BREVO_NEWSLETTER: (
    config: typeof CONFIG,
  ): config is typeof CONFIG & {
    BREVO_KEY: string
    BREVO_NEWSLETTER_LIST: number
    BREVO_NEWSLETTER_TEMPLATE_OPTIN: number
    BREVO_ADMIN_NAME: string
    BREVO_ADMIN_EMAIL: string
  } =>
    typeof config.BREVO_KEY === 'string' &&
    typeof config.BREVO_NEWSLETTER_LIST === 'number' &&
    typeof config.BREVO_NEWSLETTER_TEMPLATE_OPTIN === 'number' &&
    typeof config.BREVO_ADMIN_NAME === 'string' &&
    typeof config.BREVO_ADMIN_EMAIL === 'string',
}

export const validateConfig = (dependencies: {
  config: typeof CONFIG
  logger: Pick<Logger, 'warn'>
}) => {
  const { config } = dependencies
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(config)) {
    printConfigError(dependencies)(
      'BREVO_SEND_CONTACT functionality is disabled - some BREVO configs are missing',
    )
  }

  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_NEWSLETTER(config)) {
    printConfigError(dependencies)(
      'BREVO_NEWSLETTER functionality is disabled - some BREVO configs are missing',
    )
  }
}
