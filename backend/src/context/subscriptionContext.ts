import { context } from './context'

import type { PrismaClient } from '#src/prisma'
import type { Context } from './context'
import type { ContextFunction } from '@apollo/server'

export const subscriptionContext: (deps: {
  prisma: PrismaClient
}) => ContextFunction<[{ connectionParams: { token: string } }], Context> =
  (deps) => async (ctx) => {
    const token = ctx.connectionParams.token
    return context(deps)(token)
  }
