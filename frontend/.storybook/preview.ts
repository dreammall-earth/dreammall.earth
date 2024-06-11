import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'
import { setPageContext } from '#context/usePageContext'
import i18n from '#plugins/i18n'
import CreateVuetify from '#plugins/vuetify'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'

import { withVuetifyTheme } from './withVuetifyTheme.decorator'

import type { Preview } from '@storybook/vue3'

setup((app) => {
  // Registers your app's plugins into Storybook
  const pinia = createPinia()
  app.use(pinia)
  app.use(i18n)
  app.use(CreateVuetify(i18n, {
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  }))

  setPageContext(app, { urlPathname: '' })
})

export const decorators = [withVuetifyTheme]

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'light', title: 'Light', left: '🌞' },
        { value: 'dark', title: 'Dark', left: '🌛' },
      ],
      dynamicTitle: true,
    },
  },
  appHeight: {
    name: 'App Height',
    description: 'Height of the app container',
    defaultValue: 'auto',
    toolbar: {
      icon: 'arrows-alt-v',
      items: [
        { value: '50vh', title: '50vh' },
        { value: '75vh', title: '75vh' },
        { value: '100vh', title: '100vh' },
        { value: '100%', title: '100%' },
      ],
      dynamicTitle: true,
    },
  },
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
