import { Field, Int, ObjectType } from 'type-graphql'

import { OpenTable } from './TableModel'
import { User } from './UserModel'

@ObjectType()
export class Call {
  @Field(() => OpenTable)
  table: OpenTable

  @Field(() => [Int])
  userIds: number[]

  @Field(() => User)
  user: User
}
