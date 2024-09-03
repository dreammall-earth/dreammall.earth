import { createPubSub } from 'graphql-yoga'

import { MeetingInfo } from '#api/BBB'

export const pubSub = createPubSub<{
  OPEN_TABLE_SUBSCRIPTION: [MeetingInfo[]]
}>()
