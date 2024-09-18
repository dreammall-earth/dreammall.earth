export type LocaleCode = 'de' | 'en'
export const locales: LocaleCode[] = ['de', 'en']
export const localeDefault = 'de'
export const fallbackLocale = 'en'
export const localizedLocale = [
  { locale: 'de', title: 'Deutsch' },
  { locale: 'en', title: 'English' },
]

export function extractLocale(url: string) {
  const urlPaths = url.split('/')
  let locale: LocaleCode
  let urlWithoutLocale
  // We remove the URL locale, for example `/de/about` => `/about`
  const firstPath = urlPaths[1] as LocaleCode
  if (locales.includes(firstPath)) {
    locale = firstPath
    urlWithoutLocale = '/' + urlPaths.slice(2).join('/')
  } else {
    locale = localeDefault
    urlWithoutLocale = url
  }

  return { locale, urlWithoutLocale }
}
