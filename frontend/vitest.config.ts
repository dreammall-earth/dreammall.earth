import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      css: true,
      globals: true,
      environment: 'happy-dom',
      setupFiles: [
        'tests/mock.$t.ts',
        'tests/mock.authService.ts',
        'tests/mock.IntersectionObserver.ts',
        'tests/mock.vikePageContext.ts',
        'tests/plugin.i18n-vuetify.ts',
        'tests/plugin.pinia.ts',
      ],
      exclude: [
        ...configDefaults.exclude,
        // index page due to canvas issues
        'app/pages/index/Page.test.ts',
      ],
      coverage: {
        all: true,
        include: ['{(presenter),app,renderer,server}/**/*.{js,jsx,ts,tsx,vue}'],
        exclude: [
          ...configDefaults.exclude,
          // storybook
          '**/*{.,-}stories.?(c|m)[jt]s?(x)',
          'app/components/starmap/*',
        ],
        thresholds: {
          lines: 90,
          // functions: 20, // has problems see https://github.com/vitest-dev/vitest/issues/3607
          branches: 90,
          statements: 90,
        },
      },
    },
  }),
)
