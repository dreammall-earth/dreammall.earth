import { Resolver, Query, Authorized } from 'type-graphql'

import { createMeeting, getMeetings } from '#api/BBB'
import { CONFIG } from '#config/config'

@Resolver()
export class RoomResolver {
  @Authorized()
  @Query(() => String)
  // eslint-disable-next-line @typescript-eslint/require-await
  async getRoom(): Promise<string> {
    return CONFIG.ROOM_LINK
  }

  @Query(() => Boolean)
  async test(): Promise<boolean> {
    try {
      const result = await createMeeting({
        name: 'My Meeting ßß',
        meetingID: 'xxx',
      })
      console.log(result)
    } catch (err) {
      console.log(err)
      return false
    }
    return true
  }
}
