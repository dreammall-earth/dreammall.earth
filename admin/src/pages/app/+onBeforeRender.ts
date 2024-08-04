import type { PageContextBuiltInServer } from 'vike/types'
import { useAuthStore } from '#stores/auth'

export default onBeforeRender

async function onBeforeRender(pageContext: PageContextBuiltInServer) {
  const authStore = useAuthStore()
  
  // Überprüfen Sie den Auth-Status
  const isLoggedIn = await authStore.checkAuth()

  if (!isLoggedIn) {
    // Wenn nicht eingeloggt, leiten Sie zur Startseite um
    return {
      pageContext: {
        redirectTo: '/'
      }
    }
  }

  // Wenn eingeloggt, fahren Sie normal fort
  return {
    pageContext: {
      pageProps: pageContext.routeParams,
    },
  }
}