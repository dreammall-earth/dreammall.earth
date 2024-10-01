import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      css: true,
      globals: true,
      environment: 'happy-dom',
      setupFiles: 'src/tests/setupFiles/vueTestUtilsConfig.ts',
      exclude: [
        ...configDefaults.exclude,
        // index page due to canvas issues
        'src/pages/index/Page.test.ts',
      ],
      coverage: {
        all: true,
        include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
        exclude: [
          ...configDefaults.exclude,
          // storybook
          '**/*{.,-}stories.?(c|m)[jt]s?(x)',
          'src/stories/**/*',
          'src/pages/index/*',
          'src/components/starmap/*',
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
