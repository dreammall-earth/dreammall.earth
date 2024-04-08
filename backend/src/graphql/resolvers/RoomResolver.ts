import { Resolver, Query } from 'type-graphql'

import { CONFIG } from '#config/config'

@Resolver()
export class RoomResolver {
  @Query(() => String)
  // eslint-disable-next-line @typescript-eslint/require-await
  async getRoom(): Promise<string> {
    return CONFIG.ROOM_LINK
  }
}
