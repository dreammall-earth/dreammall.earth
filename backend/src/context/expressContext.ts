import { context } from './context'

import type { PrismaClient } from '#src/prisma'
import type { Context } from './context'
import type { ContextFunction } from '@apollo/server'
import type { ExpressContextFunctionArgument } from '@apollo/server/express4'

export const expressContext: (deps: {
  prisma: PrismaClient
}) => ContextFunction<[ExpressContextFunctionArgument], Context> =
  (deps) =>
  async ({ req }) => {
    const token = req.headers.authorization
    return context(deps)(token)
  }
