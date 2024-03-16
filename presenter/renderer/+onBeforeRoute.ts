import { PageContext } from 'vike/types'

import i18n from '#plugins/i18n'
import { extractLocale } from '#root/locales/extractLocale'

export function onBeforeRoute(pageContext: PageContext) {
  if (pageContext.urlPathname.endsWith('.js'))
    return { pageContext: { urlLogical: pageContext.urlPathname } }
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlPathname)
  // eslint-disable-next-line no-console
  console.log('urlWithoutLocale', urlWithoutLocale)
  // eslint-disable-next-line no-console
  console.log('locale', locale)
  i18n.global.locale.value = locale
  return {
    pageContext: {
      // Make `locale` available as `pageContext.locale`
      locale,
      // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal
      urlLogical: urlWithoutLocale,
    },
  }
}
