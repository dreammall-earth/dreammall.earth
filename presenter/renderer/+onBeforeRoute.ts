import { PageContext } from 'vike/types'

import { extractLocale } from '#src/locales'

export function onBeforeRoute(pageContext: PageContext) {
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlPathname)

  return {
    pageContext: {
      // Make `locale` available as `pageContext.locale`
      locale,
      // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal
      urlLogical: urlWithoutLocale,
    },
  }
}
