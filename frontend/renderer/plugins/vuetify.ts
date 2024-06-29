// eslint-disable-next-line import/no-unassigned-import
import '@mdi/font/css/materialdesignicons.css'
// eslint-disable-next-line import/no-unassigned-import
import 'vuetify/styles'
import { I18n, useI18n } from 'vue-i18n'
import { ThemeDefinition, createVuetify } from 'vuetify'
import { aliases as mdiAliases } from 'vuetify/iconsets/mdi'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

import { aliases as customAliases } from '#assets/icons'
import dark from '#assets/scss/dark.module.scss'
import light from '#assets/scss/light.module.scss'

function makeThemeFromCssModule(theme: CSSModuleClasses, isDark: boolean): ThemeDefinition {
  return {
    dark: isDark,
    colors: {
      background: theme.backgroundColor,
      surface: theme.surfaceColor,
      primary: theme.primaryColor,
      secondary: theme.secondaryColor,
      success: theme.successColor,
      info: theme.infoColor,
      warning: theme.warningColor,
      error: theme.errorColor,
      font: theme.fontColor,
      icon: theme.iconColor,
      'dropdown-background': theme.dropdownBackgroundColor,
    },
    variables: {
      'border-color': theme.borderColor,
      'border-opacity': theme.borderOpacity,
      // Vuetify colors don't support opacity, so we use variables instead.
      // Beware that HEX values won't work.
      'icon-background': theme.iconBackground,
      'bottom-menu-background': theme.bottomMenuBackground,
      'sidebar-background': theme.sidebarBackground,
    },
  }
}

const themes = {
  light: makeThemeFromCssModule(light, false),
  dark: makeThemeFromCssModule(dark, true),
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
      themes,
    },
  })
