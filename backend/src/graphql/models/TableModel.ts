import { Meeting } from '@prisma/client'
import { ObjectType, Field, Int, registerEnumType } from 'type-graphql'

import { MeetingInfo, AttendeeInfo } from '#src/api/BBB'
import { UsersWithMeetings } from '#src/prisma'

import { Attendee } from './AttendeeModel'
import { UserInMeeting } from './UserInMeetingModel'

enum MeetingType {
  'PERMANENT' = 'PERMANENT',
  'PROJECT' = 'PROJECT',
  'MALL_TALK' = 'MALL_TALK',
}

registerEnumType(MeetingType, {
  name: 'MeetingType',
})

@ObjectType()
export class Table {
  constructor(data: Pick<Table, 'id' | 'name' | 'public' | 'users' | 'type'>) {
    Object.assign(this, data)
  }

  static fromMeeting(meeting: Meeting, usersWithMeetings: UsersWithMeetings[]) {
    const { id, name, type } = meeting
    const users = usersWithMeetings.map((u) => new UserInMeeting(u))
    return new Table({ id, name, public: meeting.public, users, type: type as MeetingType })
  }

  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  public: boolean

  @Field(() => MeetingType)
  type: MeetingType

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
