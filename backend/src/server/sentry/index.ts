import {
  setupExpressErrorHandler as setupExpress,
  init,
  withScope,
  captureException,
} from '@sentry/node'

import { createApolloPlugin } from './createApolloPlugin'

import type { NodeOptions } from '@sentry/node'

const sentry = { withScope, captureException }

export type Sentry = typeof sentry

export const setupSentry = (sentryOptions: NodeOptions) => {
  init(sentryOptions)
  const apolloPlugin = createApolloPlugin(sentryOptions, sentry)
  return {
    apolloPlugin,
    setupExpress,
    sentry,
  }
}
