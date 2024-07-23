import { User as DbUser } from '@prisma/client'
import { ObjectType, Field, Int, registerEnumType } from 'type-graphql'

import { AttendeeRole } from '#api/BBB'

registerEnumType(AttendeeRole, {
  name: 'AttendeeRole',
  description: 'Role of the user in the meeting',
})

@ObjectType()
export class User {
  constructor(user: DbUser) {
    this.id = user.id
    this.username = user.username
    this.name = user.name
  }

  @Field(() => Int)
  id: number

  @Field()
  username: string

  @Field()
  name: string
}

@ObjectType()
export class CurrentUser {
  constructor(user: DbUser) {
    this.id = user.id
    this.username = user.username
    this.name = user.name
  }

  @Field(() => Int)
  id: number

  @Field()
  username: string

  @Field()
  name: string
}

@ObjectType()
export class UserInMeeting {
  constructor(user: DbUser, role: AttendeeRole) {
    this.id = user.id
    this.username = user.username
    this.name = user.name
    this.role = role
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
