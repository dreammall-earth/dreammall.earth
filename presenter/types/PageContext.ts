import { Page } from '#types/Page'
import { PageProps } from '#types/PageProps'

export type {
  PageContextServer,

  // When using Client Routing https://vike.dev/clientRouting
  PageContextClient,
  PageContext as VikePageContext,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient,
  // When using Server Routing
  /*
  PageContextClientWithServerRouting as PageContextClient,
  PageContextWithServerRouting as PageContext,
  */
  //* /
} from 'vike/types'

export type PageContext = {
  Page: Page
  pageProps?: PageProps
  urlPathname: string
  config: {
    title: string | ((pageContext: PageContext) => string) | undefined
    description: string | ((pageContext: PageContext) => string) | undefined
  }
}
