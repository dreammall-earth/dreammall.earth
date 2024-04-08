import { Resolver, Query } from 'type-graphql'

import { CONFIG } from '#config/config'

@Resolver()
export class RoomResolver {
  @Query(() => String)
  getRoom(): Promise<string> {
    return CONFIG.ROOM_LINK
  }
}
