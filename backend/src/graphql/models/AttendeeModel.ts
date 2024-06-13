import { ObjectType, Field } from 'type-graphql'

import { AttendeeInfo } from '#src/api/BBB'

@ObjectType()
export class Attendee {
  constructor(attendee: AttendeeInfo) {
    this.fullName = attendee.fullName
  }

  @Field()
  fullName: string
}
