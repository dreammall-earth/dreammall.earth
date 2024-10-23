import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'

import { OpenTable } from './TableModel'
import { User } from './UserModel'

export enum MallTalkStatus {
  'UNKNOWN' = 'UNKNOWN',
  'ACCEPTED' = 'ACCEPTED',
  'REJECTED' = 'REJECTED',
  'MISSED' = 'MISSED',
}

registerEnumType(MallTalkStatus, {
  name: 'MallTalkStatus',
  description: 'Status of the mall talk call from the point of view of the receiver',
})

@ObjectType()
export class Call {
  @Field(() => OpenTable)
  table: OpenTable

  @Field(() => [Int])
  userIds: number[]

  @Field(() => User)
  user: User
}
