import { CONFIG } from '#src/config/config'
import logger from '#src/logger'
import { prisma } from '#src/prisma'

import { deleteUser } from './deleteUser'

import type { Request } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'

export type Dependencies = {
  prisma: typeof prisma
  logger: typeof logger
  config: {
    WEBHOOK_SECRET: (typeof CONFIG)['WEBHOOK_SECRET']
  }
}

export type AuthentikPayload = {
  body: string
  severity: string
  user_email: string
  user_username: string
  event_user_email: string
  event_user_username: string
}

export const createWebhook = (deps: Dependencies) => ({
  isAuthorized: (req: Pick<Request<ParamsDictionary, unknown, AuthentikPayload>, 'query'>) => {
    const {
      config: { WEBHOOK_SECRET },
    } = deps
    if (!(WEBHOOK_SECRET && WEBHOOK_SECRET.length >= 20)) {
      return false
    }
    return req.query.authorization === WEBHOOK_SECRET
  },
  handleWebhook: async (
    req: Pick<Request<ParamsDictionary, unknown, AuthentikPayload>, 'body'>,
  ): Promise<void> => {
    const { logger } = deps
    logger.debug('Incoming authentik webhook payload', req.body)
    const { body } = req.body
    for (const handler of [deleteUser] as const) {
      const payload = handler.isEvent(body)
      if (payload) {
        await handler.handleEvent(deps)(payload)
        return
      }
    }
  },
})

export const webhook = createWebhook({ config: CONFIG, prisma, logger })
