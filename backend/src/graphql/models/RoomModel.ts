import { Meeting, User as DbUser } from '@prisma/client'
import { ObjectType, Field, Int } from 'type-graphql'

import { MeetingInfo, AttendeeInfo, AttendeeRole } from '#src/api/BBB'

import { Attendee } from './AttendeeModel'
import { UserInMeeting } from './UserModel'

interface UserWithRole {
  user: DbUser
  role: AttendeeRole
}

@ObjectType()
export class Room {
  constructor(meeting: Meeting, users: UserWithRole[]) {
    this.id = meeting.id
    this.name = meeting.name
    this.public = meeting.public
    this.users = users.map((u) => new UserInMeeting(u.user, u.role))
  }

  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  public: boolean

  @Field(() => [UserInMeeting])
  users: UserInMeeting[]
}

@ObjectType()
export class OpenRoom {
  constructor(meeting: MeetingInfo, link: string) {
    this.meetingID = meeting.meetingID
    this.meetingName = meeting.meetingName
    this.startTime = meeting.startTime.toString()
    this.participantCount = meeting.participantCount
    this.attendees =
      typeof meeting.attendees !== 'string'
        ? Array.isArray(meeting.attendees.attendee)
          ? meeting.attendees.attendee.map((a: AttendeeInfo) => new Attendee(a))
          : [meeting.attendees.attendee]
        : []
    this.joinLink = link
  }

  @Field()
  meetingID: string

  @Field()
  meetingName: string

  @Field(() => String)
  startTime: string

  @Field(() => Int)
  participantCount: number

  @Field(() => [Attendee])
  attendees: Attendee[]

  @Field()
  joinLink: string
}
