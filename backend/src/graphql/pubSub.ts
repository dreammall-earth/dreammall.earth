import { createPubSub } from 'graphql-yoga'

export const pubSub = createPubSub<{
  OPEN_ROOM_SUBSCRIPTION: [string]
}>()
