import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['scripts/tests/mock.$t.ts', 'scripts/tests/plugin.vuetify.ts'],
      coverage: {
        all: true,
        include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
        exclude: [
          ...configDefaults.exclude,
          // storybook
          '**/*{.,-}stories.?(c|m)[jt]s?(x)',
        ],
        statements: 98,
        branches: 92,
        functions: 88,
        lines: 98,
      },
    },
  }),
)
