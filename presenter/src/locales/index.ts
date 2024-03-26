export { extractLocale } from './extractLocale'
export type LocaleCode = 'de' | 'en'
export const locales: LocaleCode[] = ['de', 'en']
export const localeDefault = 'de'
export const fallbackLocale = 'en'
export const localizedLocale = [
  { locale: 'de', title: 'Deutsch' },
  { locale: 'en', title: 'English' },
]
