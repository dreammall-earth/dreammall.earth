import { AuthChecker } from 'type-graphql'

import { Context } from '#src/context'

export const authChecker: AuthChecker<Context> = ({ context }) => {
  return !!context.user
}
