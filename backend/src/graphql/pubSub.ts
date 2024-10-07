import { createPubSub } from 'graphql-yoga'

import { MeetingInfo } from '#api/BBB'
import { InvitedTable } from '#models/InvitedTable'

export const pubSub = createPubSub<{
  OPEN_TABLE_SUBSCRIPTION: [MeetingInfo[]]
  INVITE_TABLE_SUBSCRIPTION: [InvitedTable]
}>()
