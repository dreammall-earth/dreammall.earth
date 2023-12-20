// eslint-disable-next-line import/no-cycle
import { CONFIG, CONFIG_CHECKS } from './config'

const printConfigError = (error: string) => {
  // eslint-disable-next-line n/no-process-env
  switch (process.env.NODE_ENV) {
    case 'test':
      return
    case 'production':
      throw new Error(error)
    default:
      // eslint-disable-next-line no-console
      console.warn(error)
  }
}

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
