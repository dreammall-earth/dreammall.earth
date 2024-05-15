// eslint-disable-next-line import/no-unassigned-import
import '@mdi/font/css/materialdesignicons.css'
// eslint-disable-next-line import/no-unassigned-import
import 'vuetify/styles'
import { I18n, useI18n } from 'vue-i18n'
import { ThemeDefinition, createVuetify } from 'vuetify'
import { aliases as mdiAliases } from 'vuetify/iconsets/mdi'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

import { aliases as customAliases } from '#assets/icons'

import light from '#assets/scss/light.module.scss'
import dark from '#assets/scss/dark.module.scss'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: light.backgroundColor,
    surface: light.surfaceColor,
    primary: light.primaryColor,
    secondary: light.secondaryColor,
    success: light.successColor,
    info: light.infoColor,
    warning: light.warningColor,
    error: light.errorColor,
    font: light.fontColor,
    icon: light.iconColor,
    'icon-background': light.iconBackgroundColor,
  },
  variables: {
    'border-color': light.borderColor,
    'border-opacity': light.borderOpacity,
  },
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: dark.backgroundColor,
    surface: dark.surfaceColor,
    primary: dark.primaryColor,
    secondary: dark.secondaryColor,
    success: dark.successColor,
    info: dark.infoColor,
    warning: dark.warningColor,
    error: dark.errorColor,
    font: dark.fontColor,
    icon: dark.iconColor,
    'icon-background': dark.iconBackgroundColor,
  },
  variables: {
    'border-color': dark.borderColor,
    'border-opacity': dark.borderOpacity,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (i18n: I18n<any, NonNullable<unknown>, NonNullable<unknown>, string, false>) =>
  createVuetify({
    locale: {
      adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
    ssr: true,
    icons: {
      aliases: { ...mdiAliases, ...customAliases },
    },
    theme: {
      defaultTheme: 'light',
      themes: { light: lightTheme, dark: darkTheme },
    },
  })
