import { DefaultApolloClient } from '@vue/apollo-composable'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PageContext } from 'vike/types'
import { createSSRApp, defineComponent, h, markRaw, reactive, Component, provide } from 'vue'
import Vue3Toasity from 'vue3-toastify'
// eslint-disable-next-line import/no-unassigned-import
import 'vue3-toastify/dist/index.css'

import PageShell from '#app/components/PageShell.vue'
import AuthService from '#app/services/AuthService'
import { useAuthStore } from '#app/stores/authStore'
import { setPageContext } from '#renderer/context/usePageContext'
import { createApolloClient } from '#renderer/plugins/apollo'
import GlobalErrorHandler from '#renderer/plugins/globalErrorHandler'
import i18n from '#renderer/plugins/i18n'
import pinia from '#renderer/plugins/pinia'
import CreateVuetify from '#renderer/plugins/vuetify'

import type { ToastContainerOptions } from 'vue3-toastify'

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
      provide('authService', new AuthService(pageContext.publicEnv.AUTH))
      provide('pageContext', pageContext)
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
  app.use(Vue3Toasity, {
    autoClose: 3000,
    style: {
      opacity: '1',
      userSelect: 'initial',
    },
  } as ToastContainerOptions)
  app.use(GlobalErrorHandler)

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
