import { createPubSub } from 'graphql-yoga'

import { MeetingInfo } from '#api/BBB'

export const pubSub = createPubSub<{
  OPEN_ROOM_SUBSCRIPTION: [MeetingInfo[]]
}>()
