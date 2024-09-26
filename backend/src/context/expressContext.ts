import { context } from './context'

import type { Context } from './context'
import type { ContextFunction } from '@apollo/server'
import type { ExpressContextFunctionArgument } from '@apollo/server/express4'

export const expressContext: ContextFunction<[ExpressContextFunctionArgument], Context> = async ({
  req,
}) => {
  const token = req.headers.authorization
  return context(token)
}
