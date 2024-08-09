import { ObjectType, Field } from 'type-graphql'

import { User } from './UserModel'

@ObjectType()
export class AdminDashboardModel {
  @Field(() => [User])
  users: User[]
}
