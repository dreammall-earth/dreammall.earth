import { redirect } from 'vike/abort'

import pinia from '#plugins/pinia'
import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'

import type { GuardAsync } from 'vike/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  const authStore = useAuthStore(pinia)
  if (!authStore.isLoggedIn) {
    throw redirect(AUTH.UNAUTHORIZED_REDIRECT_URI)
  }
}

export { guard }
