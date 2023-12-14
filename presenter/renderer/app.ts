import { DefaultApolloClient } from '@vue/apollo-composable'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createSSRApp, defineComponent, h, markRaw, reactive, Component, provide } from 'vue'

import PageShell from '#components/PageShell.vue'
import { setPageContext } from '#context/usePageContext'
import { apolloClient } from '#plugins/apollo'
import i18n from '#plugins/i18n'
import pinia from '#plugins/pinia'
import CreateVuetify from '#plugins/vuetify'

import type { PageContext, VikePageContext } from '#types/PageContext'

const vuetify = CreateVuetify(i18n)

function createApp(pageContext: VikePageContext & PageContext, isClient = true) {
  // eslint-disable-next-line no-use-before-define
  let rootComponent: InstanceType<typeof PageWithWrapper>
  const PageWithWrapper = defineComponent({
    setup: () => {
      provide(DefaultApolloClient, apolloClient)
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

  objectAssign(app, {
    changePage: (pageContext: VikePageContext & PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    },
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make pageContext available from any Vue component
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
