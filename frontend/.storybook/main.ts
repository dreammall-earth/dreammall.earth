import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
  viteFinal: (config) => {
    // Add your Vite configuration here, if necessary
    return {
      ...config,
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
              @import "@/styles/variables.scss";
              @import "vuetify/src/styles/settings/_variables.scss";
            `,
          },
        },
      },
    }
  },
}

export default config
