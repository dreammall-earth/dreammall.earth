import {
  setupExpressErrorHandler as setupExpress,
  init,
  withScope,
  captureException,
} from '@sentry/node'

import { createApolloPlugin } from './createApolloPlugin'

import type { NodeOptions } from '@sentry/node'

export const setupSentry = (sentryOptions: NodeOptions) => {
  init(sentryOptions)
  const apolloPlugin = createApolloPlugin(sentryOptions, { withScope, captureException })
  return {
    apolloPlugin,
    setupExpress,
  }
}
