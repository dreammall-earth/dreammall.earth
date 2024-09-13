import path from 'path'

import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'
import { checker } from 'vite-plugin-checker'
import viteCompression from 'vite-plugin-compression'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

const isStorybook = () =>
  ['storybook', 'storybook:build'].includes(process.env.npm_lifecycle_event as string)

const config: UserConfig = {
  plugins: [
    vue(),
    svgLoader({
      defaultImport: 'url', // Preserve default behavior to not break anything
      svgo: false, // SVGO is disabled because it breaks the SVGs. It seems to be unmaintained.
    }),
    !isStorybook() && vike({ prerender: false }),
    vueI18n({
      ssr: true,
      include: path.resolve(__dirname, './src/locales/**'),
      jitCompilation: false,
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
      '#storybook': path.join(__dirname, '/.storybook'),
      '#types': path.join(__dirname, '/types'),
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
