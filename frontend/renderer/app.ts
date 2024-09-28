import { DefaultApolloClient } from '@vue/apollo-composable'
import { UserManager } from 'oidc-client-ts'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PageContext } from 'vike/types'
import { createSSRApp, defineComponent, h, markRaw, reactive, Component, provide } from 'vue'
// eslint-disable-next-line import/no-unassigned-import
import 'vue3-toastify/dist/index.css'
import { toast } from 'vue3-toastify'

import PageShell from '#components/PageShell.vue'
import { setPageContext } from '#context/usePageContext'
import { createApolloClient } from '#plugins/apollo'
import { globalErrorHandler, toastErrors } from '#plugins/globalErrorHandler'
import i18n from '#plugins/i18n'
import pinia from '#plugins/pinia'
import CreateVuetify from '#plugins/vuetify'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const vuetify = CreateVuetify(i18n)

function createApp(pageContext: PageContext, isClient = true) {
  // eslint-disable-next-line no-use-before-define
  let rootComponent: InstanceType<typeof PageWithWrapper>
  const PageWithWrapper = defineComponent({
    setup: () => {
      provide(
        DefaultApolloClient,
        createApolloClient(pageContext.publicEnv.ENDPOINTS)(getToken, isClient),
      )
      const { AUTH } = pageContext.publicEnv
      try {
        const userManager = new UserManager({
          authority: AUTH.AUTHORITY,
          client_id: AUTH.CLIENT_ID,
          redirect_uri: AUTH.REDIRECT_URI,
          silent_redirect_uri: AUTH.SILENT_REDIRECT_URI,
          response_type: AUTH.RESPONSE_TYPE,
          scope: AUTH.SCOPE,
          loadUserInfo: true,
        })
        provide('authService', new AuthService({ userManager, AUTH }))
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'SecurityError')) {
          throw error
        }
        toast.error(i18n.global.t('error.enablecookie'), {
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
        })
      }
      provide('pageContext', pageContext)
      provide('toast', toast)
    },
    data: () => ({
      Page: markRaw(pageContext.Page),
      pageProps: markRaw(pageContext.pageProps || {}),
      isClient,
    }),
    created() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      rootComponent = this
    },
    render() {
      return h(
        PageShell as Component,
        {},
        {
          default: () => {
            return h(this.Page, this.pageProps)
          },
        },
      )
    },
  })

  if (isClient) {
    pinia.use(piniaPluginPersistedstate)
  }

  const app = createSSRApp(PageWithWrapper)
  app.use(pinia)
  app.use(i18n)
  app.use(vuetify)
  app.use(globalErrorHandler(toastErrors({ toast, console })))

  const auth = useAuthStore()

  const getToken = (): string => {
    return auth.accessToken
  }

  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    },
  })

  const pageContextReactive = reactive(pageContext)

  setPageContext(app, pageContextReactive)

  return { app, i18n }
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum,
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}

export { createApp }
