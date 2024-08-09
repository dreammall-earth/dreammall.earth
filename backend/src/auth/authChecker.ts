import { AuthChecker } from 'type-graphql'

import { Context } from '#src/context'

export const authChecker: AuthChecker<Context> = ({ context }, allowedRoles) => {
  if (!context.user) {
    return false
  }

  if (allowedRoles.length === 0) {
    // Matter of taste: `@Authorized()` means any authenticated user
    return true
  }

  const {
    user: { roles },
  } = context
  const userRoles: string[] = roles
  return allowedRoles.some((role) => userRoles.includes(role))
}
