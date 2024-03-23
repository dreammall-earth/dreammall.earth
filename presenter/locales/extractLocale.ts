import { locales, localeDefault, LocaleCode } from './locales'

export function extractLocale(url: string) {
  const urlPaths = url.split('/')
  let locale: LocaleCode
  let urlWithoutLocale
  // We remove the URL locale, for example `/de/about` => `/about`
  const firstPath = urlPaths[1] as LocaleCode
  if (locales.filter((locale) => locale !== localeDefault).includes(firstPath)) {
    locale = firstPath
    urlWithoutLocale = '/' + urlPaths.slice(2).join('/')
  } else {
    locale = localeDefault
    urlWithoutLocale = url
  }

  return { locale, urlWithoutLocale }
}
