import { PageContextServer } from 'vike/types'

import { locales, localeDefault } from '#root/locales'

export { onPrerenderStart }

function onPrerenderStart(prerenderContext: { pageContexts: PageContextServer[] }): {
  prerenderContext: {
    pageContexts: PageContextServer[]
  }
} {
  const storePageContexts: PageContextServer[] = []
  prerenderContext.pageContexts.forEach((pageContext) => {
    // Duplicate pageContext for each locale
    locales.forEach((locale) => {
      // Localize URL
      let { urlOriginal } = pageContext
      urlOriginal = `/${locale}${urlOriginal}`
      storePageContexts.push({
        ...pageContext,
        urlOriginal,
        // Set pageContext.locale
        locale,
      })
    })
  })
  return {
    prerenderContext: {
      pageContexts: storePageContexts,
    },
  }
}
