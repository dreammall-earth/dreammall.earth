import { prisma } from '#src/prisma'

import { createMockConfig } from './mockConfig'

import type { createBrevoClient } from '#src/api/Brevo'
import type { Context } from '#src/context'

export const mockContextValue: (overrides?: Partial<Context>) => Context = (overrides = {}) => {
  const config = createMockConfig()
  const sentry = {
    withScope: jest.fn(),
    captureException: jest.fn(),
  }
  const brevo = {
    sendContactEmails: jest.fn(),
    subscribeToNewsletter: jest.fn(),
    confirmNewsletter: jest.fn(),
  } as ReturnType<typeof createBrevoClient>
  const defaults: Context = {
    user: null,
    config,
    brevo,
    dataSources: { prisma },
    sentry,
  }
  return {
    ...defaults,
    ...overrides,
  }
}
