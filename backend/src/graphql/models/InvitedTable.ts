import { Field, ObjectType } from 'type-graphql'

import { OpenTable } from './TableModel'
import { User } from './UserModel'

@ObjectType()
export class InvitedTable {
  @Field(() => OpenTable)
  table: OpenTable

  @Field(() => User)
  user: User
}
