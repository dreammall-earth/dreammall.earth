import path from 'path'

import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import { UserConfig } from 'vite'

const isStorybook = () =>
  ['storybook', 'storybook:build'].includes(process.env.npm_lifecycle_event as string)

const config: UserConfig = {
  plugins: [
    vue(),
    !isStorybook() && vike(), // SSR only when storybook is not running
    vueI18n({
      ssr: true,
      include: path.resolve(__dirname, './src/locales/**'),
    }),
  ],
  build: {
    outDir: './build',
  },
  ssr: { noExternal: ['vuetify'] },
  resolve: {
    alias: {
      '#root': __dirname,
      '#src': path.join(__dirname, '/src'),
      '#components': path.join(__dirname, '/src/components'),
      '#pages': path.join(__dirname, '/src/pages'),
      '#assets': path.join(__dirname, '/src/assets'),
      '#layouts': path.join(__dirname, '/src/layouts'),
      '#stores': path.join(__dirname, '/src/stores'),
      '#plugins': path.join(__dirname, '/renderer/plugins'),
      '#context': path.join(__dirname, '/renderer/context'),
      '#types': path.join(__dirname, '/types'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/assets/sass/style.scss";
        `
      }
    }
  }
}

export default config
