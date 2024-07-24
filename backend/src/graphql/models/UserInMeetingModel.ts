import { ObjectType, Field, Int, registerEnumType } from 'type-graphql'

import { AttendeeRole } from '#api/BBB'
import { UsersWithMeetings } from '#src/prisma'

registerEnumType(AttendeeRole, {
  name: 'AttendeeRole',
  description: 'Role of the user in the meeting',
})

@ObjectType()
export class UserInMeeting {
  constructor(user: UsersWithMeetings) {
    this.id = user.user.id
    this.username = user.user.username
    this.name = user.user.name
    this.role = user.role as AttendeeRole
  }

  @Field(() => Int)
  id: number

  @Field()
  username: string

  @Field()
  name: string

  @Field(() => AttendeeRole)
  role: AttendeeRole
}
