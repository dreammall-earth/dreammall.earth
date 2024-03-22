import { PageContext } from 'vike/types'

import { extractLocale } from '#root/locales/extractLocale'

export function onBeforeRoute(pageContext: PageContext) {
  if (pageContext.urlPathname.endsWith('.js')) {
    return { pageContext: { urlLogical: pageContext.urlPathname } }
  }

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
