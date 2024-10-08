import { webhook as authentik } from './Authentik'
import { webhook as bbb } from './BBB'

import type { Express, Request } from 'express'

interface Webhook {
  isAuthorized: (req: Request) => boolean
  handleWebhook: (req: Request) => void
}

export const webhooks: Record<string, Webhook> = {
  '/bbb-webhook': bbb,
  '/authentik-webhook': authentik,
} as const

export const installWebhooks = (app: Express, webhooks: Record<string, Webhook>) => {
  for (const [route, webhook] of Object.entries(webhooks)) {
    app.post(route, function requestHandler(req, res) {
      if (webhook.isAuthorized(req)) {
        res.status(200)
        res.end('Webhook received')
        void webhook.handleWebhook(req)
      } else {
        res.status(403)
        res.end('Webhook not allowed')
      }
    })
  }
}
