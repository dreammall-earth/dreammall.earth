import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { defineConfig } from 'cypress'

let emailLink: string

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config)

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  )

  on('task', {
    setEmailLink: (link: string) => {
      return (emailLink = link)
    },
    getEmailLink: () => {
      return emailLink
    },
  })

  return config
}

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    experimentalOriginDependencies: true,
    baseUrl: 'http://localhost:3000/',
    specPattern: 'cypress/e2e/features/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    retries: 0,
    video: false,
    viewportHeight: 1080,
    viewportWidth: 1920,
    env: {
      authentikURL: 'http://localhost:9000/',
      backendURL: 'http://localhost:4000/',
      mailpitURL: 'http://localhost:8025/',
    },
    setupNodeEvents,
  },
  includeShadowDom: true,
})
