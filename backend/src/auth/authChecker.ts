import { AuthChecker } from 'type-graphql'

import { Context } from '#src/server/context'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authChecker: AuthChecker<Context> = ({ root, args, context, info }, roles) => {
  console.log('authChecker', context)

  const { token } = context

  if (!token) return false

  return true
}
