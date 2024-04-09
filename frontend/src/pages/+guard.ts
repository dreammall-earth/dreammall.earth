import { redirect } from 'vike/abort'

import { AUTH } from '#src/env'

import type { GuardSync } from 'vike/types'

const guard: GuardSync = (pageContext): ReturnType<GuardSync> => {
  if (!pageContext.hasToken) {
    throw redirect(AUTH.UNAUTHORIZED_REDIRECT_URI)
  }
}

export { guard }
