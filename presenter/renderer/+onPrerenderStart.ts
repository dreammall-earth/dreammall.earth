import { PageContextServer } from 'vike/types'

export { onPrerenderStart }

const locales = ['en', 'de']
const localeDefault = 'de'

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
      if (locale !== localeDefault) {
        urlOriginal = `/${locale}${urlOriginal}`
      }
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
