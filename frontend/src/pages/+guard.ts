import { redirect } from 'vike/abort'

import pinia from '#plugins/pinia'
import { useAuthStore } from '#stores/authStore'

import type { GuardSync } from 'vike/types'

const guard: GuardSync = (pageContext): ReturnType<GuardSync> => {
  // the store is the client side part, pageContext the serverSide part
  // there might be a better solution to combine both into pageContext
  const authStore = useAuthStore(pinia)
  if (!pageContext.hasToken && !authStore.isLoggedIn) {
    throw redirect('/signin')
  }
}

export { guard }
