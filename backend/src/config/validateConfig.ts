/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateConfig = (config: any) => {
  if (!config.BREVO_KEY) {
    printConfigError('Missing BREVO_KEY in config')
  }

  if (
    config.BREVO_KEY &&
    (!config.BREVO_CONTACT_REQUEST_TO_EMAIL ||
      !config.BREVO_CONTACT_REQUEST_TO_NAME ||
      !config.BREVO_TEMPLATE_CONTACT_BASE ||
      !config.BREVO_TEMPLATE_CONTACT_USER ||
      !config.BREVO_CONTACT_LIST_ID)
  ) {
    printConfigError('BREVO_KEY is set, but one or more of the required BREVO configs are missing')
  }
}
