import logger from '#src/logger'
import { prisma } from '#src/prisma'

import type { EventType } from '#src/prisma'

interface EventOptions {
  involvedEmail?: string
  involvedUserId?: number
}

export const Event = async (type: EventType, eventOptions?: EventOptions) => {
  logger.info('Event', { type, eventOptions })
  return await prisma.event.create({ data: { type, ...eventOptions } })
}
