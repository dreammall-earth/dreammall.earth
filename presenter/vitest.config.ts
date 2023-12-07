import { defineConfig, mergeConfig } from 'vitest/config'

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
          // default value copied
          'coverage/**',
          'dist/**',
          '**/[.]**',
          'packages/*/test?(s)/**',
          '**/*.d.ts',
          '**/virtual:*',
          '**/__x00__*',
          '**/\x00*',
          'cypress/**',
          'test?(s)/**',
          'test?(-*).?(c|m)[jt]s?(x)',
          '**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)',
          '**/__tests__/**',
          '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
          '**/vitest.{workspace,projects}.[jt]s?(on)',
          '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
          // storybook
          '**/*{.,-}stories.?(c|m)[jt]s?(x)',
          'src/stories/**/*',
        ],
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
        // 100: true,
      },
    },
  }),
)
