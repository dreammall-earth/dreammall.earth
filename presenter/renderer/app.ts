import { DefaultApolloClient } from '@vue/apollo-composable'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PageContext } from 'vike/types'
import { createSSRApp, defineComponent, h, markRaw, reactive, Component, provide } from 'vue'

import { setPageContext } from '#renderer/context/usePageContext'
import { createApolloClient } from '#renderer/plugins/apollo'
import i18n from '#renderer/plugins/i18n'
import pinia from '#renderer/plugins/pinia'
import CreateVuetify from '#renderer/plugins/vuetify'
import PageShell from '#src/components/PageShell.vue'
import { locales } from '#src/locales'

const vuetify = CreateVuetify(i18n)

function createApp(pageContext: PageContext, isClient = true) {
  // eslint-disable-next-line no-use-before-define
  let rootComponent: InstanceType<typeof PageWithWrapper>
  const PageWithWrapper = defineComponent({
    setup: () => {
      provide(DefaultApolloClient, createApolloClient(pageContext.publicEnv.ENDPOINTS))
      provide('pageContext', pageContext)
    },
    data: () => ({
      Page: markRaw(pageContext.Page),
      pageProps: markRaw(pageContext.pageProps || {}),
      locale: markRaw(pageContext.locale || {}),
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

  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
      rootComponent.locale = markRaw(pageContext.locale || {})
    },
  })

  const pageContextReactive = reactive(pageContext)

  setPageContext(app, pageContextReactive)

  if (pageContext.locale && locales.includes(pageContext.locale)) {
    i18n.global.locale.value = pageContext.locale
  }

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
