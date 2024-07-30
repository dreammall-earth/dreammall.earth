import { Meeting } from '@prisma/client'
import { ObjectType, Field, Int } from 'type-graphql'

import { MeetingInfo, AttendeeInfo } from '#src/api/BBB'
import { UsersWithMeetings } from '#src/prisma'

import { Attendee } from './AttendeeModel'
import { UserInMeeting } from './UserInMeetingModel'

@ObjectType()
export class Table {
  constructor(meeting: Meeting, users: UsersWithMeetings[]) {
    this.id = meeting.id
    this.name = meeting.name
    this.public = meeting.public
    this.users = users.map((u) => new UserInMeeting(u))
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
export class OpenTable {
  constructor(meeting: MeetingInfo, link: string, id: number) {
    this.id = id
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

  @Field(() => Int)
  id: number
  
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
