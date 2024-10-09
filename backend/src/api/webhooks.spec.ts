import express from 'express'
import request from 'supertest'

import { installWebhooks } from './webhooks'

describe('installWebhooks', () => {
  describe('authorization', () => {
    describe('if isAuthorize returns false', () => {
      const webhook = {
        isAuthorized: () => false,
        handleWebhook: jest.fn(),
      }

      it('responds with 403', async () => {
        const app = express()
        installWebhooks(app, { '/': webhook })
        await expect(request(app).post('/')).resolves.toMatchObject({
          status: 403,
          text: 'Webhook not allowed',
        })
      })

      it('does not call webhook handler', async () => {
        const app = express()
        installWebhooks(app, { '/': webhook })
        await request(app).post('/')
        expect(webhook.handleWebhook).not.toHaveBeenCalled()
      })
    })

    describe('if `isAuthorize` returns true', () => {
      const webhook = {
        isAuthorized: () => true,
        handleWebhook: jest.fn(),
      }

      it('responds with 200', async () => {
        const app = express()
        installWebhooks(app, { '/': webhook })
        await expect(request(app).post('/')).resolves.toMatchObject({
          status: 200,
          text: 'Webhook received',
        })
      })

      it('calls webhook handler', async () => {
        const app = express()
        installWebhooks(app, { '/': webhook })
        await request(app).post('/')
        expect(webhook.handleWebhook).toHaveBeenCalledWith(expect.anything())
      })
    })
  })
})
