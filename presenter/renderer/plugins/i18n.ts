import { createI18n } from 'vue-i18n'
import { de as vuetifyDe, en as vuetifyEn } from 'vuetify/locale'

import de from '#src/locales/de.json'
import en from '#src/locales/en.json'

export default createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  globalInjection: true,
  locale: 'de',
  fallbackLocale: 'en',
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
