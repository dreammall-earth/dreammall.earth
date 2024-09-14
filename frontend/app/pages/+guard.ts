import { redirect } from 'vike/abort'

import { useAuthStore } from '#app/stores/authStore'
import pinia from '#renderer/plugins/pinia'

import type { GuardSync } from 'vike/types'

const guard: GuardSync = (pageContext): ReturnType<GuardSync> => {
  // the store is the client side part, pageContext the serverSide part
  // there might be a better solution to combine both into pageContext
  const authStore = useAuthStore(pinia)
  if (!pageContext.hasToken && !authStore.isLoggedIn) {
    throw redirect('/app/signin')
  }
}

export { guard }
