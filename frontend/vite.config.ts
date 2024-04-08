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
  // base: '/app/', // process.env.BASE_URL,
  plugins: [
    vue(),
    !isStorybook() &&
      vike({
        prerender: true,
        // baseAssets: 'https://stage1.dreammall.earth/app/',
        baseAssets: '/app/',
        baseServer: '/app/',
      }), // SSR only when storybook is not running
    vueI18n({
      ssr: true,
      include: path.resolve(__dirname, './src/locales/**'),
      jitCompilation: false,
    }),
    checker({
      typescript: true,
      vueTsc: true,
    }),
    vuetify({ styles: { configFile: './src/assets/sass/style.scss' } }),
    viteCompression({ filter: /\.*$/i }),
  ],
  build: {
    outDir: './build',
  },
  ssr: { noExternal: ['vuetify'] },
  resolve: {
    alias: {
      '#components': path.join(__dirname, '/src/components'),
      '#pages': path.join(__dirname, '/src/pages'),
      '#assets': path.join(__dirname, '/src/assets'),
      '#layouts': path.join(__dirname, '/src/layouts'),
      '#stores': path.join(__dirname, '/src/stores'),
      '#src': path.join(__dirname, '/src'),
      '#plugins': path.join(__dirname, '/renderer/plugins'),
      '#context': path.join(__dirname, '/renderer/context'),
      '#types': path.join(__dirname, '/types'),
      '#root': __dirname,
    },
  },
  assetsInclude: isStorybook() ? ['/sb-preview/runtime.js'] : [],
  server: {
    hmr: {
      clientPort: isNaN(Number(process.env.PORT_HMR)) ? 24678 : Number(process.env.PORT_HMR),
      port: isNaN(Number(process.env.PORT_HMR)) ? 24678 : Number(process.env.PORT_HMR),
    },
  },
}

export default config
