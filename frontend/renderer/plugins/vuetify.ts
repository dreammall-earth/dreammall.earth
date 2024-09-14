// eslint-disable-next-line import/no-unassigned-import
import '@mdi/font/css/materialdesignicons.css'
// eslint-disable-next-line import/no-unassigned-import
import 'vuetify/styles'
import { useI18n } from 'vue-i18n'
import { ThemeDefinition, createVuetify } from 'vuetify'
import { aliases as mdiAliases } from 'vuetify/iconsets/mdi'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

import { aliases as customAliases } from '#assets/icons'
import dark from '#assets/scss/dark.module.scss'
import light from '#assets/scss/light.module.scss'

import type I18n from '#renderer/plugins/i18n'

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
      'cockpit-highlight': theme.cockpitHighlightColor,
      'dm-panel-submit-color': theme.dmPanelSubmitColor,
      'dm-panel-submit-background-color': theme.dmPanelSubmitBackgroundColor,
      'dm-panel-text-input-color': theme.dmPanelTextInputColor,
      'dm-panel-call-action-button-color': theme.dmPanelCallActionButtonColor,
      'dm-panel-call-action-button-background-color': theme.dmPanelCallActionButtonBackgroundColor,
      'dm-panel-call-action-button-indicator-color': theme.dmPanelCallActionButtonIndicatorColor,
      'dm-panel-call-action-button-indicator-background-color':
        theme.dmPanelCallActionButtonIndicatorBackgroundColor,
      'dm-panel-reminder-text-color': theme.dmPanelReminderTextColor,
      'dm-panel-reminder-link-color': theme.dmPanelReminderLinkColor,
    },
    variables: {
      'border-color': theme.borderColor,
      'border-opacity': theme.borderOpacity,
      // Vuetify colors don't support opacity, so we use variables instead.
      // Beware that HEX values won't work.
      'icon-background': theme.iconBackground,
      'bottom-menu-background': theme.bottomMenuBackground,
      'sidebar-background': theme.sidebarBackground,
      'cockpit-input-background': theme.cockpitInputBackground,
      'cockpit-element-background': theme.cockpitElementBackground,
      'cockpit-chip-background': theme.cockpitChipBackground,
      'cockpit-chip-background-2': theme.cockpitChipBackground2,
      'panel-background': theme.panelBackground,
      'panel-element-background': theme.panelElementBackground,
      'dm-panel-text-input-background-color': theme.dmPanelTextInputBackgroundColor,
      'dm-panel-background-color': theme.dmPanelBackgroundColor,
      'dm-panel-border-color': theme.dmPanelBorderColor,
      'dm-panel-reminder-text-background-color': theme.dmPanelReminderTextBackgroundColor,
      'dm-panel-reminder-link-background-color': theme.dmPanelReminderLinkBackgroundColor,
    },
  }
}

const themes = {
  light: makeThemeFromCssModule(light, false),
  dark: makeThemeFromCssModule(dark, true),
}

export default (i18n: typeof I18n) =>
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
