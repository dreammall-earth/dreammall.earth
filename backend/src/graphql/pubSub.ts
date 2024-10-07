import { createPubSub } from 'graphql-yoga'

import { MeetingInfo } from '#api/BBB'
import { Call } from '#models/Call'

export const pubSub = createPubSub<{
  OPEN_TABLE_SUBSCRIPTION: [MeetingInfo[]]
  CALL_SUBSCRIPTION: [Call]
}>()
