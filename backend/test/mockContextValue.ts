import { prisma } from '#src/prisma'

import type { Context } from '#src/context'

export const mockContextValue: (overrides?: Partial<Context>) => Context = (overrides = {}) => {
  const defaults: Context = {
    user: null,
    config: {
      BREVO_KEY: '',
      BREVO_ADMIN_NAME: '',
      BREVO_ADMIN_EMAIL: '',
      BREVO_CONTACT_TEMPLATE_ADMIN: 1,
      BREVO_CONTACT_TEMPLATE_USER: 2,
      BREVO_NEWSLETTER_TEMPLATE_OPTIN: 3,
      BREVO_NEWSLETTER_LIST: 3,
      BBB_SHARED_SECRET: '',
      BBB_URL: '',
      BBB_PULL_MEETINGS: '',
      BBB_WEBHOOK_URL: '',
      FRONTEND_URL: '',
      JWKS_URI: '',
    },
    dataSources: { prisma },
  }
  return {
    ...defaults,
    ...overrides,
  }
}
