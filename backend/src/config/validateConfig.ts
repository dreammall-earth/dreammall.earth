// ATTENTION: Due to import cycle this file cannot be included!
import { printConfigError } from './printConfigError'
// eslint-disable-next-line import/no-cycle, import/order
import { CONFIG, CONFIG_CHECKS } from './config'

export const validateConfig = () => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(CONFIG)) {
    printConfigError(
      'BREVO_SEND_CONTACT functionality is disabled - some BREVO configs are missing',
    )
  }

  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SUBSCRIBE_NEWSLETTER(CONFIG)) {
    printConfigError(
      'BREVO_SUBSCRIBE_NEWSLETTER functionality is disabled - some BREVO configs are missing',
    )
  }
}
