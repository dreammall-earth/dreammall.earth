import { LocaleCode } from '#src/locales'
import { Page } from '#types/Page'
import { PageProps } from '#types/PageProps'

import type { publicEnv } from '#root/server/config'

declare global {
  namespace Vike {
    interface PageContext {
      urlPathname: string
      publicEnv: typeof publicEnv
      config: {
        title: string | ((pageContext: PageContext) => string) | undefined
        description: string | ((pageContext: PageContext) => string) | undefined
      }
      Page: Page
      pageProps?: PageProps
      locale?: LocaleCode
    }
  }
}
