import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { hopeTheme } from 'vuepress-theme-hope'

export default defineUserConfig({
  // meta
  title: 'E2E Cypress Cucumber Boilerplate Documentation',
  description: 'IT4C - E2E Cypress Cucumber Boilerplate Documentation',
  dest: 'build/docs',
  base: process.env.VUEPRESS_BASE ? `/${process.env.VUEPRESS_BASE}/` : '/',
  pagePatterns: ['**/*.md', '**/LICENSE', '!.vuepress', '!node_modules'],
  // bundler
  bundler: viteBundler({}),
  // theme
  theme: hopeTheme({
    favicon: 'favicon.ico',
    logo: '/it4c-logo2-clean-bg_alpha-128x128.png',
    contributors: false,
    docsBranch: 'master',
    docsDir: '.',
    docsRepo: 'https://github.com/IT4Change/boilerplate-e2e-cypress-cucumber',
    editLink: true,
    lastUpdated: false,
    print: false,
    repo: 'IT4Change/boilerplate-e2e-cypress-cucumber',
    repoLabel: 'GitHub',
    repoDisplay: true,
    displayFooter: true,
    footer: 'CC BY IT4C.dev & Authors - <a href="https://it4c.dev/imprint.html">Imprint</a>',
    navbarLayout: {
      start: ['Brand'],
      end: ['Repo', 'Outlook', 'Search'],
    },
    plugins: {
      mdEnhance: {
        imgSize: true
      },
      searchPro: {
        indexContent: true,
        autoSuggestions: true,
        customFields: [
          {
            getter: (page) => page.frontmatter.category,
            formatter: "Category: $content",
          },
          {
            getter: (page) => page.frontmatter.tag,
            formatter: "Tag: $content",
          },
        ],
      }
    }
  }),
})
