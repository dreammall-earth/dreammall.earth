import { prisma } from '#src/prisma'

import { EventType } from './EventType'

export const Event = async (type: EventType, involvedEmail?: string) =>
  await prisma.event.create({ data: { type, involvedEmail } })
