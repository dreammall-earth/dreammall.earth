import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      css: true,
      globals: true,
      environment: 'jsdom',
      setupFiles: [
        'scripts/tests/mock.$t.ts',
        'scripts/tests/mock.vikePageContext.ts',
        'scripts/tests/mock.apolloClient.ts',
        'scripts/tests/mock.authService.ts',
        'scripts/tests/mock.location.ts',
        'scripts/tests/resizeObserverPolyfill.ts',
        'scripts/tests/plugin.pinia.ts',
        'scripts/tests/plugin.i18n-vuetify.ts',
      ],
      server: {
        deps: {
          inline: ['vuetify'],
        },
      },
      coverage: {
        all: true,
        include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
        exclude: [
          ...configDefaults.exclude,
          // storybook
          '**/*{.,-}stories.?(c|m)[jt]s?(x)',
          'src/stories/**/*',
        ],
        thresholds: {
          lines: 98,
          // functions: 20, // has problems see https://github.com/vitest-dev/vitest/issues/3607
          branches: 96,
          statements: 98,
        },
      },
    },
  }),
)
