import { Meeting } from '@prisma/client'
import { ObjectType, Field, Int } from 'type-graphql'

import { MeetingInfo, AttendeeInfo } from '#src/api/BBB'

import { Attendee } from './AttendeeModel'

@ObjectType()
export class Room {
  constructor(meeting: Meeting) {
    this.id = meeting.id
    this.name = meeting.name
  }

  @Field(() => Int)
  id: number

  @Field()
  name: string
}

@ObjectType()
export class OpenRoom {
  constructor(meeting: MeetingInfo, link: string) {
    this.meetingID = meeting.meetingID
    this.meetingName = meeting.meetingName
    this.startTime = meeting.startTime
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

  @Field(() => Int)
  startTime: number

  @Field(() => Int)
  participantCount: number

  @Field(() => [Attendee])
  attendees: Attendee[]

  @Field()
  joinLink: string
}
