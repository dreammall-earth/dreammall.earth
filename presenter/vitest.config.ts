import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: [
        'src/tests/mock.$t.ts',
        'src/tests/mock.vikePageContext.ts',
        'src/tests/mock.apolloClient.ts',
        'src/tests/mock.IntersectionObserver.ts',
        'src/tests/plugin.pinia.ts',
        'src/tests/plugin.i18n-vuetify.ts',
      ],
      coverage: {
        all: true,
        include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
        exclude: [
          ...configDefaults.exclude,
          // storybook
          '**/*{.,-}stories.?(c|m)[jt]s?(x)',
        ],
        thresholds: {
          lines: 98,
          // functions: 73, // has problems see https://github.com/vitest-dev/vitest/issues/3607
          branches: 95,
          statements: 98,
        },
      },
    },
  }),
)
