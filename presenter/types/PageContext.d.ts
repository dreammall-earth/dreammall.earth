import { Page } from '#types/Page'
import { PageProps } from '#types/PageProps'

declare global {
  namespace Vike {
    interface PageContext {
      urlPathname: string
      config: {
        title: string | ((pageContext: PageContext) => string) | undefined
        description: string | ((pageContext: PageContext) => string) | undefined
      }
      Page: Page
      pageProps?: PageProps
    }
  }
}

// If you define Vike.PagContext in a .d.ts file then
// make sure there is at least one export/import statment.
// Tell TypeScript this file isn't an ambient module:
export {}
