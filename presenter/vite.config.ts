import path from 'path'

import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'
import { checker } from 'vite-plugin-checker'
import viteCompression from 'vite-plugin-compression'
import vuetify from 'vite-plugin-vuetify'

const isStorybook = () =>
  ['storybook', 'storybook:build'].includes(process.env.npm_lifecycle_event as string)

const config: UserConfig = {
  plugins: [
    vue(),
    !isStorybook() && vike({ prerender: false }), // SSR only when storybook is not running
    vueI18n({
      ssr: true,
      include: path.resolve(__dirname, './src/locales/**.json'),
      jitCompilation: false,
      runtimeOnly: false,
    }),
    checker({
      typescript: true,
      vueTsc: true,
    }),
    vuetify({ styles: { configFile: './src/assets/scss/style.scss' } }),
    viteCompression({ filter: /\.*$/i }),
  ],
  build: {
    outDir: './build',
  },
  ssr: { noExternal: ['vuetify'] },
  resolve: {
    alias: {
      '#src': path.join(__dirname, '/src'),
      '#renderer': path.join(__dirname, '/renderer'),
      '#types': path.join(__dirname, '/types'),
    },
  },
  assetsInclude: isStorybook() ? ['/sb-preview/runtime.js'] : [],
}

export default config
