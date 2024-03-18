import { PageContext } from 'vike/types'

import { extractLocale } from '#root/locales/extractLocale'
import { useLocaleStore } from '#stores/localeStore'

export function onBeforeRoute(pageContext: PageContext) {
  if (pageContext.urlPathname.endsWith('.js')) return { pageContext: {} }
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlPathname)
  // eslint-disable-next-line no-console
  console.log('urlWithoutLocale', urlWithoutLocale)
  // eslint-disable-next-line no-console
  console.log('locale', locale)
  const localeStore = useLocaleStore()
  localeStore.save(locale)
  return {
    pageContext: {
      // Make `locale` available as `pageContext.locale`
      locale,
      // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal
      urlLogical: urlWithoutLocale,
    },
  }
}
