import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'

import { User } from './UserModel'

import type { MallTalkHistoryWithUsers } from '#src/prisma'

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
export class MallTalkHistoryIncoming {
  constructor(data: Pick<MallTalkHistoryWithUsers, 'id' | 'from' | 'status'>) {
    Object.assign(this, data)
  }

  @Field(() => Int)
  id: number

  @Field(() => User)
  from: User

  @Field(() => MallTalkStatus)
  status: MallTalkStatus
}
