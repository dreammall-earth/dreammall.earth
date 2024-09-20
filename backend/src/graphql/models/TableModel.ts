import { Meeting } from '@prisma/client'
import { ObjectType, Field, Int } from 'type-graphql'

import { MeetingInfo, AttendeeInfo } from '#src/api/BBB'
import { UsersWithMeetings } from '#src/prisma'

import { Attendee } from './AttendeeModel'
import { UserInMeeting } from './UserInMeetingModel'

@ObjectType()
export class Table {
  constructor(data: Pick<Table, 'id' | 'name' | 'public' | 'users'>) {
    Object.assign(this, data)
  }

  static fromMeeting(meeting: Meeting, usersWithMeetings: UsersWithMeetings[]) {
    const { id, name } = meeting
    const users = usersWithMeetings.map((u) => new UserInMeeting(u))
    return new Table({ id, name, public: meeting.public, users })
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
  constructor(
    data: Pick<
      OpenTable,
      'id' | 'meetingID' | 'meetingName' | 'participantCount' | 'startTime' | 'attendees'
    >,
  ) {
    Object.assign(this, data)
  }

  static fromMeetingInfo(meeting: MeetingInfo, id: number) {
    const { meetingID, meetingName, participantCount } = meeting
    const startTime = meeting.startTime.toString()
    const attendees =
      typeof meeting.attendees !== 'string'
        ? Array.isArray(meeting.attendees.attendee)
          ? meeting.attendees.attendee.map((a: AttendeeInfo) => new Attendee(a))
          : [meeting.attendees.attendee]
        : []
    return new OpenTable({
      id,
      meetingID,
      meetingName,
      participantCount,
      startTime,
      attendees,
    })
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
}
