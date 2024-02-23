import logger from '#src/logger'
import { prisma } from '#src/prisma'

import { EventType } from './EventType'

export const Event = async (type: EventType, involvedEmail?: string) => {
  logger.info('Event', { type, involvedEmail })
  return await prisma.event.create({ data: { type, involvedEmail } })
}
