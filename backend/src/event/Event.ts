import { prisma } from '#src/prisma'

import { EventType } from './EventType'

export const Event = (type: EventType, involvedEmail?: string) =>
  prisma.event.create({ data: { type, involvedEmail } })
