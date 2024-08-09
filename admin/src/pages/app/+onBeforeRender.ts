import { useAuthStore } from '#stores/auth'

import type { PageContextBuiltInServer } from 'vike/types'

export default onBeforeRender

function onBeforeRender(pageContext: PageContextBuiltInServer) {
  const authStore = useAuthStore()

  // Überprüfen Sie den Auth-Status
  const isLoggedIn = authStore.checkAuth()

  if (!isLoggedIn) {
    // Wenn nicht eingeloggt, leiten Sie zur Startseite um
    return {
      pageContext: {
        redirectTo: '/',
      },
    }
  }

  // Wenn eingeloggt, fahren Sie normal fort
  return {
    pageContext: {
      pageProps: pageContext.routeParams,
    },
  }
}
