import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  title: 'Dreammall.earth Documentation',
  description: 'Dreammall.earth Documentation',
  dest: 'build/docs',
  base: process.env.VUEPRESS_BASE ? `/${process.env.VUEPRESS_BASE}/` : '/',
  pagePatterns: ['**/*.md', '**/LICENSE', '!**/.vuepress', '!**/node_modules'],
  bundler: viteBundler({}),
  theme: defaultTheme({}),
})
