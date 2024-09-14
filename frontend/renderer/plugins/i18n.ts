import { createI18n } from 'vue-i18n'
import { de as vuetifyDe, en as vuetifyEn } from 'vuetify/locale'

import de from '#locales/de.json'
import en from '#locales/en.json'
import { localeDefault, fallbackLocale } from '#renderer/locales'

export default createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  globalInjection: true,
  locale: localeDefault,
  fallbackLocale,
  messages: {
    de: {
      $vuetify: vuetifyDe,
      ...de,
    },
    en: {
      $vuetify: vuetifyEn,
      ...en,
    },
  },
})
