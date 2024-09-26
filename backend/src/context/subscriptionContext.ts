import { context } from './context'

import type { Context } from './context'
import type { ContextFunction } from '@apollo/server'

export const subscriptionContext: ContextFunction<
  [{ connectionParams: { token: string } }],
  Context
> = async (ctx) => {
  const token = ctx.connectionParams.token
  return context(token)
}
