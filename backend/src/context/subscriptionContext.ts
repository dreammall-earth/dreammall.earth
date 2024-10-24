import { context } from './context'

import type { Context, ContextDependencies } from './context'
import type { ContextFunction } from '@apollo/server'

export const subscriptionContext: (
  deps: ContextDependencies,
) => ContextFunction<[{ connectionParams: { token: string } }], Context> =
  (deps) => async (ctx) => {
    const token = ctx.connectionParams.token
    return context(deps)(token)
  }
