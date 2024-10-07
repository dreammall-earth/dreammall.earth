import express from 'express'
import sentryTestkit from 'sentry-testkit'
import supertest from 'supertest'
import waitForExpect from 'wait-for-expect'

import { setupSentry } from '.'

import type { Transport } from '@sentry/types'

const tk = sentryTestkit()
const testkit = tk.testkit
const transport = tk.sentryTransport as () => Transport

describe('setupSentry.setupExpress', () => {
  beforeEach(() => testkit.reset())

  const createExpressApp = (setupExpress: ReturnType<typeof setupSentry>['setupExpress']) => {
    const app = express()
    app.get('/crash-me', () => {
      throw new Error('Congrats, you crashed me!')
    })
    setupExpress(app)
    return app
  }

  describe('any unhandled error', () => {
    let setup: ReturnType<typeof setupSentry>['setupExpress']
    beforeAll(() => {
      const dsn =
        'https://398434ec1dc210d86b97cdd3b076bc53@o111205.ingest.us.sentry.io/4508065015922688'
      setup = setupSentry({ dsn, transport }).setupExpress
    })

    it('sends the error to Sentry', async () => {
      const app = createExpressApp(setup)
      await supertest(app).get('/crash-me').expect(500)
      await waitForExpect(() => expect(testkit.reports().length).toBeGreaterThan(0))
      expect(testkit.findReport(new Error('Congrats, you crashed me!'))).toBeDefined()
    })
  })
})
