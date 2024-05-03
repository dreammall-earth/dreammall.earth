import { redirect } from 'vike/abort'

import pinia from '#plugins/pinia'
import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'

import type { GuardSync } from 'vike/types'

const guard: GuardSync = (pageContext): ReturnType<GuardSync> => {
  // the store is the client side part, pageContext the serverSide part
  // there might be a better solution to combine both into pageContext
  const authStore = useAuthStore(pinia)
  if (!pageContext.hasToken && !authStore.isLoggedIn) {
    throw redirect(AUTH.UNAUTHORIZED_REDIRECT_URI)
  }
}

export { guard }
