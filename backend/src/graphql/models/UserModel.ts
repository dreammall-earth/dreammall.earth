import { User as DbUser, Meeting } from '@prisma/client'
import { ObjectType, Field, Int } from 'type-graphql'

import { UsersWithMeetings } from '#src/prisma'

import { Room } from './RoomModel'

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
  constructor(user: DbUser, meeting: Meeting | null, users: UsersWithMeetings[]) {
    this.id = user.id
    this.username = user.username
    this.name = user.name
    this.room = meeting ? new Room(meeting, users) : null
  }

  @Field(() => Int)
  id: number

  @Field()
  username: string

  @Field()
  name: string

  @Field(() => Room, { nullable: true })
  room: Room | null
}
